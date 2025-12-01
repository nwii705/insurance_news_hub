"""
TVPL (Thu Vien Phap Luat) Advanced Crawler - Module A: "Legal Watchdog"
Enhanced with Playwright, proxy rotation, and comprehensive field extraction.
"""

import logging
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import re
import random

try:
    from playwright.async_api import async_playwright, Page, Browser
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    logging.warning("Playwright not available. Install with: pip install playwright && playwright install")

from bs4 import BeautifulSoup
from app.crawlers.base_crawler import BaseCrawler
from app.core.config import settings

logger = logging.getLogger(__name__)


class TVPLAdvancedCrawler(BaseCrawler):
    """
    Advanced Legal Watchdog for Thu Vien Phap Luat (thuvienphapluat.vn).
    
    Features:
    - Multiple targeted search queries
    - Playwright for JavaScript rendering & anti-bot evasion
    - Proxy rotation support
    - User-agent spoofing
    - Status checking (Còn hiệu lực/Hết hiệu lực)
    - Comprehensive field extraction
    """
    
    # Targeted search queries for insurance regulations
    SEARCH_QUERIES = [
        "Bảo hiểm",                      # Insurance
        "Kinh doanh bảo hiểm",           # Insurance business
        "Bộ Tài chính bảo hiểm",         # Ministry of Finance insurance
        "Bảo hiểm xã hội",               # Social insurance
        "Nghị định bảo hiểm",            # Insurance decrees
        "Thông tư bảo hiểm",             # Insurance circulars
        "Công văn bảo hiểm",             # Insurance dispatches
    ]
    
    # Document types to focus on (Nghị định, Thông tư, Công văn)
    PRIORITY_DOC_TYPES = [
        "Nghị định",      # Decree
        "Thông tư",       # Circular
        "Công văn",       # Official Dispatch
        "Quyết định",     # Decision
        "Luật",           # Law
        "Chỉ thị",        # Directive
    ]
    
    def __init__(self, use_playwright: bool = True):
        super().__init__()
        self.base_url = settings.TVPL_BASE_URL
        self.search_url = settings.TVPL_SEARCH_URL
        self.use_playwright = use_playwright and PLAYWRIGHT_AVAILABLE
        self.browser: Optional[Browser] = None
        self.proxies = self._load_proxies()
    
    def _load_proxies(self) -> List[str]:
        """
        Load proxy list for rotation.
        
        Add your proxies here or load from file/environment variable.
        Format: 'http://user:pass@proxy.com:port' or 'http://proxy.com:port'
        """
        proxies = []
        
        # Load from environment if available
        proxy_list = getattr(settings, 'PROXY_LIST', '')
        if proxy_list:
            proxies = [p.strip() for p in proxy_list.split(',') if p.strip()]
        
        # Example proxies (replace with your own)
        # proxies = [
        #     'http://proxy1.example.com:8080',
        #     'http://proxy2.example.com:8080',
        # ]
        
        return proxies
    
    def _get_random_proxy(self) -> Optional[str]:
        """Get random proxy from list."""
        if not self.proxies:
            return None
        return random.choice(self.proxies)
    
    def _get_random_user_agent(self) -> str:
        """Get random user agent to avoid bot detection."""
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ]
        return random.choice(user_agents)
    
    async def _init_playwright(self):
        """Initialize Playwright browser with anti-detection measures."""
        if not PLAYWRIGHT_AVAILABLE:
            raise ImportError("Playwright not available. Install with: pip install playwright && playwright install")
        
        playwright = await async_playwright().start()
        
        # Launch with anti-detection measures
        launch_options = {
            'headless': True,
            'args': [
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
            ]
        }
        
        # Add proxy if available
        proxy = self._get_random_proxy()
        if proxy:
            launch_options['proxy'] = {'server': proxy}
            logger.info(f"Using proxy: {proxy}")
        
        self.browser = await playwright.chromium.launch(**launch_options)
    
    async def _close_playwright(self):
        """Close Playwright browser."""
        if self.browser:
            await self.browser.close()
    
    def crawl(self, max_pages: int = 5, queries: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        Main crawl method - orchestrates the crawling process.
        
        Args:
            max_pages: Maximum pages per query
            queries: Custom search queries (default: predefined)
            
        Returns:
            List of legal document dictionaries
        """
        if self.use_playwright:
            return asyncio.run(self._crawl_async(max_pages, queries))
        else:
            return self._crawl_sync(max_pages, queries)
    
    async def _crawl_async(self, max_pages: int, queries: Optional[List[str]]) -> List[Dict[str, Any]]:
        """Async crawl using Playwright for better anti-bot evasion."""
        queries = queries or self.SEARCH_QUERIES
        all_documents = []
        seen_doc_numbers = set()
        
        await self._init_playwright()
        
        try:
            for query_idx, query in enumerate(queries, 1):
                logger.info(f"[{query_idx}/{len(queries)}] Crawling TVPL for: '{query}'")
                
                for page_num in range(1, max_pages + 1):
                    try:
                        search_url = self.build_search_url(keyword=query, page=page_num)
                        
                        # Create new page with anti-detection
                        browser_page = await self.browser.new_page()
                        
                        # Set headers
                        await browser_page.set_extra_http_headers({
                            'User-Agent': self._get_random_user_agent(),
                            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        })
                        
                        # Navigate with timeout
                        logger.info(f"  Page {page_num}/{max_pages}: {search_url}")
                        await browser_page.goto(search_url, wait_until='networkidle', timeout=30000)
                        
                        # Random human-like delay
                        await asyncio.sleep(random.uniform(2, 4))
                        
                        # Get page content
                        content = await browser_page.content()
                        soup = BeautifulSoup(content, 'lxml')
                        
                        # Parse results
                        documents = self.parse_search_results(soup)
                        
                        if not documents:
                            logger.info(f"  No documents found on page {page_num} for '{query}'")
                            break
                        
                        # Filter duplicates and validate
                        new_docs = []
                        for doc in documents:
                            doc_num = doc.get('doc_number')
                            if doc_num and doc_num not in seen_doc_numbers:
                                # Fetch full details if needed
                                if not doc.get('content_summary'):
                                    full_details = await self._fetch_document_details_async(doc.get('original_link'), browser_page)
                                    if full_details:
                                        doc.update(full_details)
                                
                                seen_doc_numbers.add(doc_num)
                                new_docs.append(doc)
                        
                        all_documents.extend(new_docs)
                        logger.info(f"  Found {len(new_docs)} new documents (Total: {len(all_documents)})")
                        
                        await browser_page.close()
                        
                    except Exception as e:
                        logger.error(f"  Error on page {page_num}: {e}")
                        continue
                    
                    # Delay between pages
                    await asyncio.sleep(random.uniform(3, 6))
                
                # Delay between queries
                if query_idx < len(queries):
                    await asyncio.sleep(random.uniform(5, 10))
        
        finally:
            await self._close_playwright()
        
        # Filter by document type priority
        filtered_docs = self._filter_priority_documents(all_documents)
        
        logger.info(f"✓ Crawling complete: {len(filtered_docs)}/{len(all_documents)} priority documents")
        return filtered_docs
    
    async def _fetch_document_details_async(self, url: str, page: Page) -> Optional[Dict[str, Any]]:
        """Fetch full document details using existing Playwright page."""
        if not url:
            return None
        
        try:
            await page.goto(url, wait_until='networkidle', timeout=20000)
            await asyncio.sleep(random.uniform(1, 2))
            
            content = await page.content()
            soup = BeautifulSoup(content, 'lxml')
            
            return self._extract_document_fields(soup, url)
        
        except Exception as e:
            logger.error(f"Error fetching details from {url}: {e}")
            return None
    
    def _crawl_sync(self, max_pages: int, queries: Optional[List[str]]) -> List[Dict[str, Any]]:
        """Synchronous crawl using requests (fallback method)."""
        queries = queries or self.SEARCH_QUERIES
        all_documents = []
        seen_doc_numbers = set()
        
        for query_idx, query in enumerate(queries, 1):
            logger.info(f"[{query_idx}/{len(queries)}] Crawling TVPL for: '{query}'")
            
            for page_num in range(1, max_pages + 1):
                # Update user agent for each request
                self.session.headers['User-Agent'] = self._get_random_user_agent()
                
                search_url = self.build_search_url(keyword=query, page=page_num)
                soup = self.fetch_page(search_url)
                
                if not soup:
                    logger.warning(f"  Failed to fetch page {page_num}")
                    continue
                
                documents = self.parse_search_results(soup)
                
                if not documents:
                    logger.info(f"  No documents found on page {page_num}")
                    break
                
                # Filter duplicates
                new_docs = []
                for doc in documents:
                    doc_num = doc.get('doc_number')
                    if doc_num and doc_num not in seen_doc_numbers:
                        seen_doc_numbers.add(doc_num)
                        new_docs.append(doc)
                
                all_documents.extend(new_docs)
                logger.info(f"  Found {len(new_docs)} new documents (Total: {len(all_documents)})")
        
        filtered_docs = self._filter_priority_documents(all_documents)
        logger.info(f"✓ Crawling complete: {len(filtered_docs)}/{len(all_documents)} priority documents")
        return filtered_docs
    
    def build_search_url(self, keyword: str, page: int = 1, doc_type: Optional[str] = None) -> str:
        """Build TVPL search URL with parameters."""
        # URL encode Vietnamese characters
        import urllib.parse
        
        params = {
            'keyword': keyword,
            'page': page,
        }
        
        if doc_type:
            params['loaivb'] = doc_type
        
        query_string = urllib.parse.urlencode(params, encoding='utf-8')
        return f"{self.search_url}?{query_string}"
    
    def parse_search_results(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """
        Parse search results page.
        
        Extraction: Số hiệu văn bản, Ngày ban hành, Trích yếu, Link toàn văn
        """
        documents = []
        
        # TVPL selectors (adjust based on actual site structure)
        result_items = soup.select('.item-row, .document-item, .result-item, .itemdoc')
        
        for item in result_items:
            try:
                doc_data = self._extract_preview_data(item)
                if doc_data:
                    documents.append(doc_data)
            except Exception as e:
                logger.debug(f"Error parsing item: {e}")
                continue
        
        return documents
    
    def _extract_preview_data(self, item) -> Optional[Dict[str, Any]]:
        """Extract data from search result item."""
        # Extract link
        link_elem = item.select_one('a.title, a.doc-title, h3 a, a.linktitle')
        if not link_elem:
            return None
        
        doc_url = link_elem.get('href', '')
        if doc_url and not doc_url.startswith('http'):
            doc_url = f"{self.base_url}{doc_url}"
        
        # Extract fields
        title = link_elem.get_text(strip=True)
        doc_number = self.extract_text(item, '.so-hieu, .doc-number, .number')
        abstract = self.extract_text(item, '.trich-yeu, .abstract, .sapo, .summary')
        
        # Extract date
        date_str = self.extract_text(item, '.ngay-ban-hanh, .issue-date, .date')
        issue_date = self.parse_vietnamese_date(date_str)
        
        # Extract doc type
        doc_type = self.extract_text(item, '.loai-van-ban, .doc-type, .type')
        
        return {
            'doc_number': doc_number or self._extract_doc_number_from_text(title),
            'title': title,
            'abstract': abstract,
            'doc_type': doc_type,
            'issue_date': issue_date,
            'original_link': doc_url,
            'crawled_at': datetime.now()
        }
    
    def _extract_document_fields(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """
        Extract all fields from document detail page.
        
        Fields: Số hiệu, Ngày ban hành, Trích yếu, Status (Hiệu lực), Content
        """
        data = {
            'original_link': url,
            'title': self.extract_text(soup, 'h1, .doc-title, .title'),
            'doc_number': self.extract_text(soup, '.so-hieu, .doc-number'),
            'doc_type': self.extract_text(soup, '.loai-van-ban, .doc-type'),
            'issuing_body': self.extract_text(soup, '.co-quan-ban-hanh, .issuing-body'),
            'signer': self.extract_text(soup, '.nguoi-ky, .signer'),
        }
        
        # Dates
        issue_date_str = self.extract_text(soup, '.ngay-ban-hanh, .issue-date')
        effective_date_str = self.extract_text(soup, '.ngay-hieu-luc, .effective-date')
        
        data['issue_date'] = self.parse_vietnamese_date(issue_date_str)
        data['effective_date'] = self.parse_vietnamese_date(effective_date_str)
        
        # Status (Còn hiệu lực / Hết hiệu lực)
        status_text = self.extract_text(soup, '.tinh-trang, .status, .hieu-luc')
        data['status'] = self._parse_status(status_text)
        
        # Abstract/Summary
        abstract = self.extract_text(soup, '.trich-yeu, .abstract, .tomtat')
        data['abstract'] = abstract
        
        # Full content
        content_elem = soup.select_one('.noi-dung, .content, .doc-content, .fullcontent')
        if content_elem:
            data['content_full'] = self.clean_html_content(str(content_elem))
            
            # Generate summary if abstract is empty
            if not abstract:
                text = content_elem.get_text(strip=True)
                data['abstract'] = text[:500] + '...' if len(text) > 500 else text
        
        # PDF link
        pdf_link = soup.select_one('a[href*=".pdf"], .download-pdf a, a.btnpdf')
        if pdf_link:
            pdf_url = pdf_link.get('href', '')
            if pdf_url and not pdf_url.startswith('http'):
                pdf_url = f"{self.base_url}{pdf_url}"
            data['pdf_url'] = pdf_url
        
        # Tags
        tags = []
        tag_elems = soup.select('.tags a, .keywords a, .tag-item')
        for tag in tag_elems:
            tag_text = tag.get_text(strip=True)
            if tag_text:
                tags.append(tag_text)
        data['tags'] = tags
        
        return data
    
    def _parse_status(self, status_text: str) -> str:
        """
        Parse document status (Hiệu lực).
        
        Returns: 'Active', 'Expired', 'Pending', or 'Unknown'
        """
        if not status_text:
            return 'Unknown'
        
        status_lower = status_text.lower()
        
        if 'còn hiệu lực' in status_lower or 'đang hiệu lực' in status_lower:
            return 'Active'
        elif 'hết hiệu lực' in status_lower or 'ngưng hiệu lực' in status_lower:
            return 'Expired'
        elif 'chưa có hiệu lực' in status_lower or 'chưa hiệu lực' in status_lower:
            return 'Pending'
        else:
            return 'Unknown'
    
    def _extract_doc_number_from_text(self, text: str) -> str:
        """Extract document number using regex."""
        if not text:
            return ''
        
        # Pattern: 123/2024/NĐ-CP or 52/2024/TT-BTC
        pattern = r'\d+/\d{4}/[\w-]+'
        match = re.search(pattern, text)
        return match.group(0) if match else ''
    
    def _filter_priority_documents(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter documents by priority types (Nghị định, Thông tư, Công văn)."""
        filtered = []
        
        for doc in documents:
            doc_type = doc.get('doc_type', '')
            
            # Check if it's a priority document type
            if any(priority_type in doc_type for priority_type in self.PRIORITY_DOC_TYPES):
                filtered.append(doc)
            # Also include if status is Active
            elif doc.get('status') == 'Active':
                filtered.append(doc)
        
        return filtered if filtered else documents  # Return all if no priority matches


# Standalone execution
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    crawler = TVPLAdvancedCrawler(use_playwright=True)
    
    print("Starting TVPL Legal Watchdog Crawler...")
    print("=" * 60)
    
    documents = crawler.crawl(max_pages=3)
    
    print(f"\n✓ Crawled {len(documents)} legal documents")
    print("=" * 60)
    
    for i, doc in enumerate(documents[:5], 1):
        print(f"\n{i}. {doc.get('doc_number')} - {doc.get('doc_type')}")
        print(f"   Title: {doc.get('title')[:80]}...")
        print(f"   Status: {doc.get('status')}")
        print(f"   Issue Date: {doc.get('issue_date')}")
        print(f"   Link: {doc.get('original_link')}")
    
    crawler.close()
