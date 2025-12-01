"""
TVPL (Thu Vien Phap Luat) Crawler - crawls legal documents.
"""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import re

from app.crawlers.base_crawler import BaseCrawler
from app.core.config import settings

logger = logging.getLogger(__name__)


class TVPLCrawler(BaseCrawler):
    """Crawler for Thu Vien Phap Luat (thuvienphapluat.vn)."""
    
    def __init__(self):
        super().__init__()
        self.base_url = settings.TVPL_BASE_URL
        self.search_url = settings.TVPL_SEARCH_URL
        
    def build_search_url(
        self, 
        keyword: str = "bảo hiểm",
        page: int = 1,
        doc_type: Optional[str] = None
    ) -> str:
        """
        Build search URL for TVPL.
        
        Args:
            keyword: Search keyword (default: "bảo hiểm")
            page: Page number
            doc_type: Document type filter
            
        Returns:
            Search URL
        """
        params = {
            'keyword': keyword,
            'page': page,
        }
        
        if doc_type:
            params['loaivb'] = doc_type
            
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        return f"{self.search_url}?{query_string}"
    
    def crawl(self, max_pages: int = 5) -> List[Dict[str, Any]]:
        """
        Crawl legal documents from TVPL.
        
        Args:
            max_pages: Maximum number of pages to crawl
            
        Returns:
            List of legal document dictionaries
        """
        all_documents = []
        
        logger.info(f"Starting TVPL crawl for insurance-related documents...")
        
        for page in range(1, max_pages + 1):
            logger.info(f"Crawling page {page}/{max_pages}")
            
            search_url = self.build_search_url(page=page)
            soup = self.fetch_page(search_url)
            
            if not soup:
                logger.warning(f"Failed to fetch page {page}, stopping...")
                break
                
            documents = self.parse_search_results(soup)
            
            if not documents:
                logger.info(f"No more documents found on page {page}, stopping...")
                break
                
            all_documents.extend(documents)
            logger.info(f"Found {len(documents)} documents on page {page}")
        
        logger.info(f"Total documents crawled: {len(all_documents)}")
        return all_documents
    
    def parse_search_results(self, soup) -> List[Dict[str, Any]]:
        """
        Parse search results page.
        
        Args:
            soup: BeautifulSoup object of search results page
            
        Returns:
            List of document preview data
        """
        documents = []
        
        # TVPL structure: Each document is in a div with class 'item-row' or 'document-item'
        # Adjust selectors based on actual TVPL structure
        result_items = soup.select('.item-row, .document-item, .result-item')
        
        for item in result_items:
            try:
                doc_data = self.parse_document_preview(item)
                if doc_data:
                    documents.append(doc_data)
            except Exception as e:
                logger.error(f"Error parsing document preview: {e}")
                continue
                
        return documents
    
    def parse_document_preview(self, item) -> Optional[Dict[str, Any]]:
        """
        Parse individual document preview from search results.
        
        Args:
            item: BeautifulSoup element containing document preview
            
        Returns:
            Dictionary with document preview data
        """
        try:
            # Extract document URL
            link_elem = item.select_one('a.title, a.doc-title, h3 a')
            if not link_elem:
                return None
                
            doc_url = link_elem.get('href', '')
            if doc_url and not doc_url.startswith('http'):
                doc_url = f"{self.base_url}{doc_url}"
                
            # Extract basic info from preview
            title = link_elem.get_text(strip=True)
            doc_number = self.extract_text(item, '.doc-number, .so-hieu, .number')
            
            # Get full document details
            doc_details = self.crawl_document_detail(doc_url)
            
            if doc_details:
                doc_details['title'] = title or doc_details.get('title', '')
                doc_details['doc_number'] = doc_number or doc_details.get('doc_number', '')
                return doc_details
                
            return None
            
        except Exception as e:
            logger.error(f"Error parsing document preview: {e}")
            return None
    
    def crawl_document_detail(self, url: str) -> Optional[Dict[str, Any]]:
        """
        Crawl full details of a legal document.
        
        Args:
            url: URL of document detail page
            
        Returns:
            Dictionary with complete document data
        """
        soup = self.fetch_page(url)
        if not soup:
            return None
            
        try:
            # Extract document metadata
            # Adjust selectors based on actual TVPL structure
            data = {
                'original_link': url,
                'title': self.extract_text(soup, 'h1.document-title, .doc-title, h1'),
                'doc_number': self.extract_text(soup, '.doc-number, .so-hieu'),
                'doc_type': self.extract_text(soup, '.doc-type, .loai-van-ban'),
                'signer': self.extract_text(soup, '.signer, .nguoi-ky'),
                'issuing_body': self.extract_text(soup, '.issuing-body, .co-quan-ban-hanh'),
            }
            
            # Extract dates
            issue_date_str = self.extract_text(soup, '.issue-date, .ngay-ban-hanh')
            effective_date_str = self.extract_text(soup, '.effective-date, .ngay-hieu-luc')
            
            data['issue_date'] = self.parse_vietnamese_date(issue_date_str)
            data['effective_date'] = self.parse_vietnamese_date(effective_date_str)
            
            # Extract content
            content_elem = soup.select_one('.doc-content, .content, .noi-dung')
            if content_elem:
                data['content_full'] = self.clean_html_content(str(content_elem))
                # Generate summary from first 500 characters
                text = content_elem.get_text(strip=True)
                data['content_summary'] = text[:500] + '...' if len(text) > 500 else text
            
            # Extract PDF link if available
            pdf_link = soup.select_one('a[href*=".pdf"], .download-pdf a')
            if pdf_link:
                pdf_url = pdf_link.get('href', '')
                if pdf_url and not pdf_url.startswith('http'):
                    pdf_url = f"{self.base_url}{pdf_url}"
                data['pdf_url'] = pdf_url
            
            # Extract tags/keywords
            tags = []
            tag_elems = soup.select('.tags a, .keywords a, .tag-item')
            for tag in tag_elems:
                tag_text = tag.get_text(strip=True)
                if tag_text:
                    tags.append(tag_text)
            data['tags'] = tags
            
            return data
            
        except Exception as e:
            logger.error(f"Error parsing document detail from {url}: {e}")
            return None
    
    def extract_doc_number(self, text: str) -> Optional[str]:
        """
        Extract document number from text using regex.
        
        Args:
            text: Text containing document number
            
        Returns:
            Document number or None
        """
        # Pattern for Vietnamese legal documents: 123/2024/NĐ-CP
        pattern = r'\d+/\d{4}/[\w-]+'
        match = re.search(pattern, text)
        return match.group(0) if match else None


# Example usage
if __name__ == "__main__":
    crawler = TVPLCrawler()
    documents = crawler.crawl(max_pages=2)
    
    for doc in documents:
        print(f"Document: {doc.get('doc_number')} - {doc.get('title')}")
    
    crawler.close()
