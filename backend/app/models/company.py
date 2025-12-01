"""
Company model - MongoDB document for insurance companies.
"""

from beanie import Document
from typing import Optional, List, Dict, Any
from pydantic import Field, HttpUrl
from datetime import datetime, date
from bson import ObjectId


class Company(Document):
    """Insurance company information."""
    
    name: str = Field(..., max_length=255, description="Company name")
    slug: str = Field(..., max_length=255, description="URL-friendly slug")
    type: str = Field(default="Other", description="Type: 'Life', 'Non-Life', 'Both', 'Other'")
    
    logo_url: Optional[str] = Field(default=None, description="Company logo URL")
    website: Optional[str] = Field(default=None, description="Company website")
    description: Optional[str] = Field(default=None, description="Company description")
    established_date: Optional[date] = Field(default=None, description="Establishment date")
    
    # Financial data
    financial_reports: List[Dict[str, Any]] = Field(default_factory=list, description="Financial reports")
    contact_info: Dict[str, Any] = Field(default_factory=dict, description="Contact information")
    
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "companies"
        indexes = [
            "slug",
            "type",
            "is_active",
        ]
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
    
    def __repr__(self):
        return f"<Company {self.name} ({self.type})>"
