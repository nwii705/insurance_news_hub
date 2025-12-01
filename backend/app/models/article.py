"""
Article model - news articles crawled and processed by AI.
"""

from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional, List
from bson import ObjectId


class Article(Document):
    """News article with AI-processed content."""
    
    # Content
    title: str = Field(..., max_length=500)
    slug: str = Field(..., max_length=500)
    summary: Optional[str] = None
    content_html: str = Field(...)
    
    # Source information
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    original_author: Optional[str] = None
    
    # Author type and disclaimer
    author_type: str = Field(default='Bot', description="'Bot' or 'Human'")
    disclaimer_level: str = Field(default='Low', description="'Low', 'Medium', 'High'")
    
    # Categorization
    category_id: Optional[ObjectId] = None
    tags: List[str] = Field(default_factory=list)
    
    # Related entities
    related_companies: List[ObjectId] = Field(default_factory=list)
    related_legal_docs: List[ObjectId] = Field(default_factory=list)
    
    # SEO and metadata
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    featured_image_url: Optional[str] = None
    featured_image_alt: Optional[str] = None
    
    # Publishing
    status: str = Field(default='draft', description="'draft', 'published', 'archived'")
    published_at: Optional[datetime] = None
    scheduled_for: Optional[datetime] = None
    
    # Engagement metrics
    view_count: int = Field(default=0)
    share_count: int = Field(default=0)
    is_featured: bool = Field(default=False)
    is_trending: bool = Field(default=False)
    
    # Timestamps
    crawled_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "articles"
        indexes = [
            "slug",
            "status",
            "published_at",
            "is_featured",
            "is_trending",
            "created_at",
        ]
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
    
    def __repr__(self):
        return f"<Article {self.title[:50]}>"
