"""
Pydantic schemas for API request/response validation.
"""

from app.schemas.article import ArticleResponse, ArticleListResponse, ArticleCreate
from app.schemas.legal_doc import LegalDocResponse, LegalDocListResponse
from app.schemas.company import CompanyResponse, CompanyListResponse
from app.schemas.category import CategoryResponse

__all__ = [
    "ArticleResponse",
    "ArticleListResponse",
    "ArticleCreate",
    "LegalDocResponse",
    "LegalDocListResponse",
    "CompanyResponse",
    "CompanyListResponse",
    "CategoryResponse",
]
