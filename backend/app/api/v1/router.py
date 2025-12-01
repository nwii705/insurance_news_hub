"""
API v1 main router.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import articles, legal_docs, companies, categories, admin

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
api_router.include_router(legal_docs.router, prefix="/legal-docs", tags=["legal-docs"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
