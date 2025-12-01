"""
News Crawler - crawls insurance news from major economic sites.
"""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import re

from app.crawlers.base_crawler import BaseCrawler
from app.core.config import settings

logger = logging.getLogger(__name__)


class NewsCrawler(BaseCrawler):
    """Crawler for Vietnamese economic news sites."""
    
    def __init__(self):
        super().__init__()
        self.sources = {
            'vnexpress': {
                'url': settings.VNEXPRESS_URL,
                'parser': self.parse_vnexpress
            },
            'cafef': {
                'url': settings.CAFEF_URL,
                'parser': self.parse_cafef
            },
            'vneconomy': {
                'url': settings.VNECONOMY_URL,
                'parser': self.parse_vneconomy
            },
            'baodautu': {
                'url': settings.BAODAUTU_URL,
                'parser': self.parse_baodautu
            },
            'dantri': {
                'url': settings.DANTRI_URL,
                'parser': self.parse_dantri
            },
        }
    
    def crawl(self, sources: Optional[List[str]] = None, max_articles_per_source: int = 10) -> List[Dict[str, Any]]:
        """
        Crawl news articles from specified sources.
        
        Args:
            sources: List of source names to crawl (default: all)
            max_articles_per_source: Maximum articles to crawl per source
            
        Returns:
            List of article dictionaries
        """
        if sources is None:
            sources = list(self.sources.keys())
        
        all_articles = []
        
        for source in sources:
            if source not in self.sources:
                logger.warning(f"Unknown source: {source}")
                continue
                
            logger.info(f"Crawling {source}...")
            
            try:
                articles = self.crawl_source(source, max_articles_per_source)
                all_articles.extend(articles)
                logger.info(f"Crawled {len(articles)} articles from {source}")
            except Exception as e:
                logger.error(f"Error crawling {source}: {e}")
                continue
        
        logger.info(f"Total articles crawled: {len(all_articles)}")
        return all_articles
    
    def crawl_source(self, source: str, max_articles: int) -> List[Dict[str, Any]]:
        """
        Crawl articles from a specific source.
        
        Args:
            source: Source name
            max_articles: Maximum number of articles to crawl
            
        Returns:
            List of article dictionaries
        """
        source_config = self.sources[source]
        url = source_config['url']
        parser = source_config['parser']
        
        soup = self.fetch_page(url)
        if not soup:
            return []
        
        articles = parser(soup, max_articles)
        
        # Add source metadata
        for article in articles:
            article['source_name'] = source
            article['crawled_at'] = datetime.now()
        
        return articles
    
    def parse_vnexpress(self, soup, max_articles: int) -> List[Dict[str, Any]]:
        """Parse VnExpress articles."""
        articles = []
        
        # VnExpress structure
        article_items = soup.select('.item-news, .item-news-common')[:max_articles]
        
        for item in article_items:
            try:
                article = self.extract_vnexpress_article(item)
                if article:
                    articles.append(article)
            except Exception as e:
                logger.error(f"Error parsing VnExpress article: {e}")
                continue
        
        return articles
    
    def extract_vnexpress_article(self, item) -> Optional[Dict[str, Any]]:
        """Extract article data from VnExpress item."""
        link_elem = item.select_one('h3 a, h2 a, .title-news a')
        if not link_elem:
            return None
        
        url = link_elem.get('href', '')
        if not url.startswith('http'):
            url = f"https://vnexpress.net{url}"
        
        return {
            'source_url': url,
            'title': link_elem.get('title', link_elem.get_text(strip=True)),
            'summary': self.extract_text(item, '.description, .desc'),
            'featured_image_url': self.extract_attr(item, 'img', 'src'),
            # Full content will be fetched separately if needed
        }
    
    def parse_cafef(self, soup, max_articles: int) -> List[Dict[str, Any]]:
        """Parse Cafef articles."""
        articles = []
        
        article_items = soup.select('.item, .box-news-item')[:max_articles]
        
        for item in article_items:
            try:
                link_elem = item.select_one('h3 a, h2 a, .title a')
                if not link_elem:
                    continue
                
                url = link_elem.get('href', '')
                if not url.startswith('http'):
                    url = f"https://cafef.vn{url}"
                
                articles.append({
                    'source_url': url,
                    'title': link_elem.get_text(strip=True),
                    'summary': self.extract_text(item, '.sapo, .description'),
                    'featured_image_url': self.extract_attr(item, 'img', 'src'),
                })
            except Exception as e:
                logger.error(f"Error parsing Cafef article: {e}")
                continue
        
        return articles
    
    def parse_vneconomy(self, soup, max_articles: int) -> List[Dict[str, Any]]:
        """Parse VnEconomy articles."""
        articles = []
        
        article_items = soup.select('.story, .item-news')[:max_articles]
        
        for item in article_items:
            try:
                link_elem = item.select_one('h3 a, h2 a')
                if not link_elem:
                    continue
                
                url = link_elem.get('href', '')
                if not url.startswith('http'):
                    url = f"https://vneconomy.vn{url}"
                
                articles.append({
                    'source_url': url,
                    'title': link_elem.get('title', link_elem.get_text(strip=True)),
                    'summary': self.extract_text(item, '.description, .sapo'),
                    'featured_image_url': self.extract_attr(item, 'img', 'data-src'),
                })
            except Exception as e:
                logger.error(f"Error parsing VnEconomy article: {e}")
                continue
        
        return articles
    
    def parse_baodautu(self, soup, max_articles: int) -> List[Dict[str, Any]]:
        """Parse Bao Dau Tu articles."""
        articles = []
        
        article_items = soup.select('.article-item, .news-item')[:max_articles]
        
        for item in article_items:
            try:
                link_elem = item.select_one('h3 a, h2 a')
                if not link_elem:
                    continue
                
                url = link_elem.get('href', '')
                if not url.startswith('http'):
                    url = f"https://baodautu.vn{url}"
                
                articles.append({
                    'source_url': url,
                    'title': link_elem.get_text(strip=True),
                    'summary': self.extract_text(item, '.summary, .description'),
                    'featured_image_url': self.extract_attr(item, 'img', 'src'),
                })
            except Exception as e:
                logger.error(f"Error parsing Bao Dau Tu article: {e}")
                continue
        
        return articles
    
    def parse_dantri(self, soup, max_articles: int) -> List[Dict[str, Any]]:
        """Parse Dan Tri articles."""
        articles = []
        
        article_items = soup.select('.article-item, .news-item')[:max_articles]
        
        for item in article_items:
            try:
                link_elem = item.select_one('h3 a, h2 a, .article-title a')
                if not link_elem:
                    continue
                
                url = link_elem.get('href', '')
                if not url.startswith('http'):
                    url = f"https://dantri.com.vn{url}"
                
                articles.append({
                    'source_url': url,
                    'title': link_elem.get('title', link_elem.get_text(strip=True)),
                    'summary': self.extract_text(item, '.article-excerpt, .description'),
                    'featured_image_url': self.extract_attr(item, 'img', 'data-src'),
                })
            except Exception as e:
                logger.error(f"Error parsing Dan Tri article: {e}")
                continue
        
        return articles
    
    def fetch_article_content(self, url: str, source: str) -> Optional[str]:
        """
        Fetch full content of an article.
        
        Args:
            url: Article URL
            source: Source name
            
        Returns:
            HTML content or None
        """
        soup = self.fetch_page(url)
        if not soup:
            return None
        
        # Source-specific content selectors
        content_selectors = {
            'vnexpress': '.fck_detail, .content-detail',
            'cafef': '.detail-content, .content',
            'vneconomy': '.detail-content, .article-content',
            'baodautu': '.article-body, .detail-content',
            'dantri': '.singular-content, .detail-content',
        }
        
        selector = content_selectors.get(source, '.content, .article-content')
        content_elem = soup.select_one(selector)
        
        if content_elem:
            return self.clean_html_content(str(content_elem))
        
        return None


# Example usage
if __name__ == "__main__":
    crawler = NewsCrawler()
    articles = crawler.crawl(sources=['vnexpress', 'cafef'], max_articles_per_source=5)
    
    for article in articles:
        print(f"Article: {article.get('title')} from {article.get('source_name')}")
    
    crawler.close()
