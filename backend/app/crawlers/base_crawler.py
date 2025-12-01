"""
Base crawler class with common functionality.
"""

import time
import logging
from typing import Optional, Dict, Any
from abc import ABC, abstractmethod
import requests
from bs4 import BeautifulSoup
from datetime import datetime

from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BaseCrawler(ABC):
    """Base crawler with common HTTP and parsing methods."""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': settings.CRAWLER_USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        })
        self.delay = settings.CRAWLER_DELAY_SECONDS
        self.max_retries = settings.CRAWLER_MAX_RETRIES
        self.timeout = settings.CRAWLER_TIMEOUT
        
    def fetch_page(self, url: str, retries: int = 0) -> Optional[BeautifulSoup]:
        """
        Fetch a page and return BeautifulSoup object.
        
        Args:
            url: URL to fetch
            retries: Current retry count
            
        Returns:
            BeautifulSoup object or None if failed
        """
        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            # Respectful crawling delay
            time.sleep(self.delay)
            
            return BeautifulSoup(response.text, 'lxml')
            
        except requests.RequestException as e:
            logger.error(f"Error fetching {url}: {e}")
            
            if retries < self.max_retries:
                logger.info(f"Retrying... ({retries + 1}/{self.max_retries})")
                time.sleep(self.delay * (retries + 1))
                return self.fetch_page(url, retries + 1)
            
            return None
    
    def extract_text(self, soup: BeautifulSoup, selector: str, default: str = "") -> str:
        """Extract text from soup using CSS selector."""
        element = soup.select_one(selector)
        return element.get_text(strip=True) if element else default
    
    def extract_attr(self, soup: BeautifulSoup, selector: str, attr: str, default: str = "") -> str:
        """Extract attribute from soup using CSS selector."""
        element = soup.select_one(selector)
        if element:
            result = element.get(attr, default)
            return str(result) if result is not None else default
        return default
    
    @abstractmethod
    def crawl(self) -> list:
        """
        Main crawl method to be implemented by subclasses.
        
        Returns:
            List of crawled items
        """
        pass
    
    def parse_vietnamese_date(self, date_str: str) -> Optional[datetime]:
        """
        Parse Vietnamese date formats.
        
        Args:
            date_str: Date string in Vietnamese format
            
        Returns:
            datetime object or None
        """
        if not date_str:
            return None
            
        # Common Vietnamese date formats
        formats = [
            "%d/%m/%Y",
            "%d-%m-%Y",
            "%Y-%m-%d",
            "%d/%m/%Y %H:%M",
            "%d-%m-%Y %H:%M:%S",
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str.strip(), fmt)
            except ValueError:
                continue
                
        logger.warning(f"Could not parse date: {date_str}")
        return None
    
    def clean_html_content(self, html: str) -> str:
        """Clean and sanitize HTML content."""
        if not html:
            return ""
            
        soup = BeautifulSoup(html, 'lxml')
        
        # Remove script and style tags
        for tag in soup(['script', 'style', 'iframe', 'noscript']):
            tag.decompose()
            
        # Remove ads and tracking elements
        for tag in soup.find_all(class_=['ads', 'advertisement', 'tracking']):
            tag.decompose()
            
        return str(soup)
    
    def close(self):
        """Close the session."""
        self.session.close()
