"""
MongoDB Beanie models for the Insurance News platform.
"""

from app.models.category import Category
from app.models.company import Company
from app.models.legal_doc import LegalDocument
from app.models.article import Article
from app.models.crawl_log import CrawlLog
from app.models.seo_metadata import SEOMetadata

__all__ = [
    "Category",
    "Company",
    "LegalDocument",
    "Article",
    "CrawlLog",
    "SEOMetadata",
]
