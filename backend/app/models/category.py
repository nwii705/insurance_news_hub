"""""
Category model - MongoDB document for article categories.
"""

from beanie import Document
from typing import Optional
from pydantic import Field
from datetime import datetime


class Category(Document):
    """Article and content categories - represents 5 pillars."""
    
    name: str = Field(..., max_length=200, description="Category name")
    slug: str = Field(..., max_length=200, description="URL-friendly slug")
    description: Optional[str] = Field(default=None, description="Category description")
    sort_order: int = Field(default=0, description="Display order")
    is_active: bool = Field(default=True, description="Active status")
    article_count: int = Field(default=0, description="Number of articles")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "categories"
        indexes = [
            "slug",
            ("is_active", "sort_order"),
        ]
    
    class Config:
        arbitrary_types_allowed = True
    
    def __repr__(self):
        return f"<Category {self.name}>"
