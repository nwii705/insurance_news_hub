"""
Core configuration settings for the Insurance News backend.
Uses pydantic-settings for environment variable management.
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "Insurance News Vietnam"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    SECRET_KEY: str = Field(default="change-me-in-production-secret-key-min-32-chars")
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    
    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def parse_origins(cls, v: str) -> List[str]:
        return [origin.strip() for origin in v.split(",")]
    
    # MongoDB
    MONGODB_URI: str = Field(default="mongodb://localhost:27017")
    MONGODB_DB_NAME: str = "insurance_vietnam_db"
    
    # Supabase (optional)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None
    
    # OpenAI
    OPENAI_API_KEY: str = Field(default="")
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_MAX_TOKENS: int = 4000
    
    # Anthropic (alternative)
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20241022"
    
    # Crawler Settings
    CRAWLER_USER_AGENT: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    CRAWLER_DELAY_SECONDS: int = 2
    CRAWLER_MAX_RETRIES: int = 3
    CRAWLER_TIMEOUT: int = 30
    
    # TVPL Settings
    TVPL_BASE_URL: str = "https://thuvienphapluat.vn"
    TVPL_SEARCH_URL: str = "https://thuvienphapluat.vn/tim-van-ban.aspx"
    TVPL_CATEGORY_ID: str = "insurance"
    
    # News Sources
    NEWS_SOURCES: str = "vnexpress,cafef,vneconomy,baodautu,dantri"
    VNEXPRESS_URL: str = "https://vnexpress.net/kinh-doanh/bao-hiem"
    CAFEF_URL: str = "https://cafef.vn/bao-hiem.chn"
    VNECONOMY_URL: str = "https://vneconomy.vn/bao-hiem.htm"
    BAODAUTU_URL: str = "https://baodautu.vn/bao-hiem"
    DANTRI_URL: str = "https://dantri.com.vn/kinh-doanh/bao-hiem.htm"
    
    @field_validator("NEWS_SOURCES")
    @classmethod
    def parse_news_sources(cls, v: str) -> List[str]:
        return [source.strip() for source in v.split(",")]
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    
    # Content Processing
    MIN_ARTICLE_LENGTH: int = 300
    MAX_ARTICLE_LENGTH: int = 50000
    AI_REWRITE_ENABLED: bool = True
    AUTO_PUBLISH_ENABLED: bool = False
    
    # SEO
    SITE_URL: str = "https://yourdomain.com"
    SITE_NAME: str = "Insurance News Vietnam"
    DEFAULT_META_DESCRIPTION: str = "Latest news and legal updates on Vietnam insurance industry"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Scheduler
    CRAWL_SCHEDULE_LEGAL: str = "0 */6 * * *"  # Every 6 hours
    CRAWL_SCHEDULE_NEWS: str = "0 */2 * * *"   # Every 2 hours
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Allow extra fields from .env


# Global settings instance
settings = Settings()
