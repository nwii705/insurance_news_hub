"""
SEOMetadata model - MongoDB document for SEO and social metrics.
"""

from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional, List, Dict, Any
from bson import ObjectId


class SEOMetadata(Document):
    """Tracks SEO and social media metrics for content."""
    
    content_type: str = Field(..., max_length=50, description="Type: 'article', 'legal_doc', 'category'")
    content_id: ObjectId = Field(..., description="ID of the content item")
    
    # SEO metrics
    target_keywords: List[str] = Field(default_factory=list, description="Target SEO keywords")
    search_ranking: Dict[str, Any] = Field(default_factory=dict, description="Search rankings by keyword")
    backlinks: int = Field(default=0, description="Number of backlinks")
    
    # Social metrics
    facebook_shares: int = Field(default=0, description="Facebook share count")
    twitter_shares: int = Field(default=0, description="Twitter share count")
    linkedin_shares: int = Field(default=0, description="LinkedIn share count")
    
    last_checked_at: Optional[datetime] = Field(default=None, description="Last metrics check")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "seo_metadata"
        indexes = [
            ("content_type", "content_id"),
            "last_checked_at",
        ]
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
    
    def __repr__(self):
        return f"<SEOMetadata {self.content_type}:{self.content_id}>"
