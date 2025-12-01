"""
CrawlLog model - tracks all crawling activities.
"""

from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional, Dict, Any


class CrawlLog(Document):
    """Track crawling activities for legal docs and news articles."""
    
    source: str = Field(..., description="Source name (e.g., 'thuvienphapluat', 'vnexpress')")
    crawl_type: str = Field(..., description="Type: 'legal_docs' or 'news_articles'")
    status: str = Field(default="started", description="Status: 'started', 'completed', 'failed'")
    items_found: int = Field(default=0, description="Total items discovered")
    items_processed: int = Field(default=0, description="Items successfully processed")
    error_message: Optional[str] = Field(default=None, description="Error details if failed")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    
    started_at: datetime = Field(default_factory=datetime.utcnow, description="Crawl start time")
    completed_at: Optional[datetime] = Field(default=None, description="Crawl completion time")
    
    class Settings:
        name = "crawl_logs"
        indexes = [
            "source",
            "crawl_type",
            "status",
            "started_at",
        ]
    
    class Config:
        arbitrary_types_allowed = True
    
    def __repr__(self):
        return f"<CrawlLog {self.source} - {self.status}>"
