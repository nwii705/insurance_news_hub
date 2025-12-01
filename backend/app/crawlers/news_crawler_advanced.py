"""
News Aggregator - Module B: Enhanced multi-source insurance news crawler
Targets: CafeF, VnExpress, Company Press Releases (Manulife, BaoViet, Prudential)
"""

import logging
import asyncio
from typing import List, Dict, Any, Optional, Set
from datetime import datetime
import re
import random

try:
    from playwright.async_api import async_playwright, Browser
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

from bs4 import BeautifulSoup
from app.crawlers.base_crawler import BaseCrawler
from app.core.config import settings

logger = logging.getLogger(__name__)


class NewsAggregatorAdvanced(BaseCrawler):
    """
    Advanced News Aggregator for Vietnam Insurance Industry.
    
    Features:
    - Multi-source crawling (CafeF, VnExpress, Company sites)
    - Keyword filtering
    - Playwright support
    - Content relevance scoring
    """
    
    # Insurance-related keywords for filtering
    REQUIRED_KEYWORDS = [
        "bảo hiểm",           # Insurance
        "bồi thường",         # Compensation/Claims
        "lợi nhuận bảo hiểm", # Insurance profits
        "phí bảo hiểm",       # Insurance premiums
        "doanh thu bảo hiểm", # Insurance revenue
        "thị trường bảo hiểm",# Insurance market
    ]
    
    # News sources configuration
    NEWS_SOURCES = {
        'cafef': {
            'name': 'CafeF',
            'url': 'https://cafef.vn/bao-hiem.chn',
            'category_urls': [
                'https://cafef.vn/tai-chinh-ngan-hang.chn',
                'https://cafef.vn/bao-hiem.chn',
            ],
            'selectors': {
                'article_list': '.list-news .item, .tlitem, .box-news-item',
                'title': 'h3 a, h2 a, .title a',
                'summary': '.sapo, .description',
                'image': 'img',
                'link': 'a',
            }
        },
        'vnexpress': {
            'name': 'VnExpress',
            'url': 'https://vnexpress.net/kinh-doanh/bao-hiem',
            'category_urls': [
                'https://vnexpress.net/kinh-doanh',
                'https://vnexpress.net/kinh-doanh/bao-hiem',
            ],
            'selectors': {
                'article_list': '.item-news, .item-news-common, .article-item',
                'title': 'h3 a, h2 a, .title-news a',
                'summary': '.description, .desc',
                'image': 'img',
                'link': 'a',
            }
        },
        'baoviet': {
            'name': 'Bao Viet',
            'url': 'https://www.baoviet.com.vn/vi/tin-tuc-su-kien',
            'is_company': True,
            'selectors': {
                'article_list': '.news-item, .article-item',
                'title': 'h3 a, h2 a, .title a',
                'summary': '.description, .summary',
                'image': 'img',
                'link': 'a',
            }
        },
        'manulife': {
            'name': 'Manulife Vietnam',
            'url': 'https://www.manulife.com.vn/vi/about-us/news-and-events.html',
            'is_company': True,
            'selectors': {
                'article_list': '.news-item, .article-card',
                'title': 'h3 a, h2 a, .title',
                'summary': '.description, .excerpt',
                'image': 'img',
                'link': 'a',
            }
        },
        'prudential': {
            'name': 'Prudential Vietnam',
            'url': 'https://www.prudential.com.vn/corp/prudential/vn/vi/newsroom/',
            'is_company': True,
            'selectors': {
                'article_list': '.news-list-item, .press-item',
                'title': '.title a, h3 a',
                'summary': '.summary, .description',
                'image': 'img',
                'link': 'a',
            }
        },
    }
    
    def __init__(self, use_playwright: bool = True):
        super().__init__()
        self.use_playwright = use_playwright and PLAYWRIGHT_AVAILABLE
        self.browser: Optional[Browser] = None
    
    def _get_random_user_agent(self) -> str:
        """Get random user agent."""
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        ]
        return random.choice(user_agents)
    
    async def _init_playwright(self):
        """Initialize Playwright browser."""
        if not PLAYWRIGHT_AVAILABLE:
            raise ImportError("Playwright not installed")
        
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled']
        )
    
    async def _close_playwright(self):
        """Close browser."""
        if self.browser:
            await self.browser.close()
    
    def crawl(
        self,
        sources: Optional[List[str]] = None,
        max_articles_per_source: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Crawl news from multiple sources with keyword filtering.
        
        Args:
            sources: List of source names to crawl (default: all)
            max_articles_per_source: Maximum articles per source
            
        Returns:
            List of filtered articles
        """
        if self.use_playwright:
            return asyncio.run(self._crawl_async(sources, max_articles_per_source))
        else:
            return self._crawl_sync(sources, max_articles_per_source)
    
    async def _crawl_async(
        self,
        sources: Optional[List[str]],
        max_articles: int
    ) -> List[Dict[str, Any]]:
        """Async crawl with Playwright."""
        sources = sources or list(self.NEWS_SOURCES.keys())
        all_articles = []
        seen_urls: Set[str] = set()
        
        await self._init_playwright()
        
        try:
            for source_name in sources:
                if source_name not in self.NEWS_SOURCES:
                    logger.warning(f"Unknown source: {source_name}")
                    continue
                
                source_config = self.NEWS_SOURCES[source_name]
                logger.info(f"Crawling {source_config['name']}...")
                
                try:
                    articles = await self._crawl_source_async(
                        source_name,
                        source_config,
                        max_articles
                    )
                    
                    # Filter by keywords and duplicates
                    filtered = []
                    for article in articles:
                        url = article.get('source_url', '')
                        if url and url not in seen_urls:
                            if self._is_relevant_article(article):
                                seen_urls.add(url)
                                filtered.append(article)
                    
                    all_articles.extend(filtered)
                    logger.info(f"  ✓ {len(filtered)} relevant articles from {source_config['name']}")
                    
                except Exception as e:
                    logger.error(f"Error crawling {source_name}: {e}")
                    continue
                
                # Delay between sources
                await asyncio.sleep(random.uniform(3, 5))
        
        finally:
            await self._close_playwright()
        
        logger.info(f"✓ Total: {len(all_articles)} relevant articles crawled")
        return all_articles
    
    async def _crawl_source_async(
        self,
        source_name: str,
        config: Dict[str, Any],
        max_articles: int
    ) -> List[Dict[str, Any]]:
        """Crawl a single source asynchronously."""
        articles = []
        
        # Get URLs to crawl
        urls_to_crawl = config.get('category_urls', [config['url']])
        
        for url in urls_to_crawl:
            try:
                if not self.browser:
                    raise RuntimeError("Browser not initialized")
                
                page = await self.browser.new_page()
                await page.set_extra_http_headers({
                    'User-Agent': self._get_random_user_agent(),
                    'Accept-Language': 'vi-VN,vi;q=0.9',
                })
                
                await page.goto(url, wait_until='networkidle', timeout=30000)
                await asyncio.sleep(random.uniform(2, 3))
                
                content = await page.content()
                soup = BeautifulSoup(content, 'lxml')
                
                # Parse articles
                parsed = self._parse_source_articles(soup, source_name, config)
                articles.extend(parsed[:max_articles])
                
                await page.close()
                
            except Exception as e:
                logger.debug(f"Error crawling {url}: {e}")
                continue
        
        return articles[:max_articles]
    
    def _crawl_sync(
        self,
        sources: Optional[List[str]],
        max_articles: int
    ) -> List[Dict[str, Any]]:
        """Sync crawl with requests."""
        sources = sources or list(self.NEWS_SOURCES.keys())
        all_articles = []
        seen_urls: Set[str] = set()
        
        for source_name in sources:
            if source_name not in self.NEWS_SOURCES:
                continue
            
            source_config = self.NEWS_SOURCES[source_name]
            logger.info(f"Crawling {source_config['name']}...")
            
            try:
                # Update user agent
                self.session.headers['User-Agent'] = self._get_random_user_agent()
                
                # Crawl main URL and category URLs
                urls_to_crawl = source_config.get('category_urls', [source_config['url']])
                
                for url in urls_to_crawl:
                    soup = self.fetch_page(url)
                    if not soup:
                        continue
                    
                    articles = self._parse_source_articles(soup, source_name, source_config)
                    
                    # Filter and add
                    for article in articles[:max_articles]:
                        url = article.get('source_url', '')
                        if url and url not in seen_urls and self._is_relevant_article(article):
                            seen_urls.add(url)
                            all_articles.append(article)
                
                logger.info(f"  ✓ Articles from {source_config['name']}")
                
            except Exception as e:
                logger.error(f"Error crawling {source_name}: {e}")
                continue
        
        logger.info(f"✓ Total: {len(all_articles)} relevant articles")
        return all_articles
    
    def _parse_source_articles(
        self,
        soup: BeautifulSoup,
        source_name: str,
        config: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Parse articles from a specific source."""
        articles = []
        selectors = config.get('selectors', {})
        
        # Find all article items
        items = soup.select(selectors.get('article_list', '.article-item'))
        
        for item in items:
            try:
                # Extract title and link
                title_elem = item.select_one(selectors.get('title', 'a'))
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                link = title_elem.get('href', '')
                
                # Complete relative URLs
                if link and not link.startswith('http'):
                    base_url = config['url'].split('/')[0] + '//' + config['url'].split('/')[2]
                    if link.startswith('/'):
                        link = base_url + link
                    else:
                        link = base_url + '/' + link
                
                # Extract summary
                summary = self.extract_text(item, selectors.get('summary', '.summary'))
                
                # Extract image
                img_elem = item.select_one(selectors.get('image', 'img'))
                img_url = img_elem.get('src') or img_elem.get('data-src') if img_elem else None
                
                article = {
                    'source_name': source_name,
                    'source_display_name': config['name'],
                    'source_url': link,
                    'title': title,
                    'summary': summary,
                    'featured_image_url': img_url,
                    'crawled_at': datetime.now(),
                    'is_company_source': config.get('is_company', False)
                }
                
                articles.append(article)
                
            except Exception as e:
                logger.debug(f"Error parsing article item: {e}")
                continue
        
        return articles
    
    def _is_relevant_article(self, article: Dict[str, Any]) -> bool:
        """
        Filter articles by keywords.
        
        Only accept articles containing:
        - "Bảo hiểm"
        - "Bồi thường"
        - "Lợi nhuận bảo hiểm"
        - "Phí bảo hiểm"
        """
        title = (article.get('title') or '').lower()
        summary = (article.get('summary') or '').lower()
        
        combined_text = f"{title} {summary}"
        
        # Check if any required keyword is present
        for keyword in self.REQUIRED_KEYWORDS:
            if keyword.lower() in combined_text:
                return True
        
        return False
    
    def fetch_article_content(self, url: str, source_name: str) -> Optional[str]:
        """
        Fetch full article content from URL.
        
        Args:
            url: Article URL
            source_name: Source identifier
            
        Returns:
            HTML content
        """
        soup = self.fetch_page(url)
        if not soup:
            return None
        
        # Source-specific content selectors
        content_selectors = {
            'vnexpress': '.fck_detail, .content-detail',
            'cafef': '.detail-content, .content',
            'baoviet': '.news-content, .article-body',
            'manulife': '.content, .article-content',
            'prudential': '.content-body, .news-content',
        }
        
        selector = content_selectors.get(source_name, '.content, .article-content, .detail-content')
        content_elem = soup.select_one(selector)
        
        if content_elem:
            return self.clean_html_content(str(content_elem))
        
        return None


# Standalone execution
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    crawler = NewsAggregatorAdvanced(use_playwright=True)
    
    print("Starting News Aggregator...")
    print("=" * 60)
    print("Sources: CafeF, VnExpress, Company Press Releases")
    print("Filtering by keywords: Bảo hiểm, Bồi thường, Lợi nhuận, Phí bảo hiểm")
    print("=" * 60)
    
    articles = crawler.crawl(
        sources=['cafef', 'vnexpress', 'baoviet'],
        max_articles_per_source=5
    )
    
    print(f"\n✓ Found {len(articles)} relevant articles")
    print("=" * 60)
    
    for i, article in enumerate(articles[:5], 1):
        print(f"\n{i}. [{article['source_display_name']}] {article['title'][:80]}")
        print(f"   Summary: {article.get('summary', '')[:100]}...")
        print(f"   Link: {article['source_url']}")
    
    crawler.close()
