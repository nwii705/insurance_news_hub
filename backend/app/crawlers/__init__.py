"""
Crawlers package - web scrapers for TVPL and news sites.
"""

from app.crawlers.tvpl_crawler import TVPLCrawler
from app.crawlers.news_crawler import NewsCrawler

__all__ = ["TVPLCrawler", "NewsCrawler"]
