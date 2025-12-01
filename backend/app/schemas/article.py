"""
Article schemas.
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID


class ArticleBase(BaseModel):
    """Base article schema."""
    title: str
    summary: Optional[str] = None
    content_html: str
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    category_id: Optional[UUID] = None
    tags: List[str] = []
    featured_image_url: Optional[str] = None
    status: str = "draft"


class ArticleCreate(ArticleBase):
    """Schema for creating an article."""
    pass


class ArticleResponse(ArticleBase):
    """Schema for article response."""
    id: UUID
    slug: str
    author_type: str
    disclaimer_level: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    related_companies: List[UUID] = []
    related_legal_docs: List[UUID] = []
    view_count: int
    share_count: int
    is_featured: bool
    is_trending: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    """Schema for paginated article list."""
    items: List[ArticleResponse]
    total: int
    page: int
    page_size: int
    pages: int
