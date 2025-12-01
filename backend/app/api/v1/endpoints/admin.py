"""
Admin API endpoints - MongoDB version.
"""

from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()


@router.get("/stats", response_model=Dict[str, Any])
async def get_stats():
    """Get database statistics."""
    from app.models.article import Article
    from app.models.legal_doc import LegalDocument
    from app.models.category import Category
    from app.models.company import Company
    from app.models.crawl_log import CrawlLog
    
    stats = {
        "articles": {
            "total": await Article.count(),
            "published": await Article.find(Article.status == "published").count(),
            "featured": await Article.find(Article.is_featured == True).count(),
        },
        "legal_docs": {
            "total": await LegalDocument.count(),
            "featured": await LegalDocument.find(LegalDocument.is_featured == True).count(),
        },
        "categories": await Category.count(),
        "companies": await Company.count(),
        "crawl_logs": await CrawlLog.count(),
    }
    
    return stats


@router.get("/health", response_model=Dict[str, str])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "database": "mongodb"}
