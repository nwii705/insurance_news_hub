"""
ArticleVersion model - version control for articles.
"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.database import Base


class ArticleVersion(Base):
    __tablename__ = "article_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    article_id = Column(UUID(as_uuid=True), ForeignKey("articles.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    
    title = Column(String(500))
    content_html = Column(Text)
    summary = Column(Text)
    
    edited_by = Column(String(100))  # 'Bot' or human editor name
    change_reason = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<ArticleVersion {self.article_id} v{self.version_number}>"
