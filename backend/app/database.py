"""
MongoDB connection using Motor (async) and Beanie ODM.
"""

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import Any

from app.core.config import settings


class DatabaseManager:
    """MongoDB database connection manager."""
    
    def __init__(self):
        self.client: Any = None
    
    def get_client(self) -> Any:
        """Get the MongoDB client instance."""
        return self.client


# Create global instance
db_manager = DatabaseManager()


async def connect_to_mongo():
    """Connect to MongoDB and initialize Beanie ODM."""
    try:
        # Create MongoDB client
        db_manager.client = AsyncIOMotorClient(settings.MONGODB_URI)
        
        # Get database
        client = db_manager.client
        if client is None:
            raise Exception("Failed to create MongoDB client")
            
        database = client[settings.MONGODB_DB_NAME]
        
        # Import all models
        from app.models.article import Article
        from app.models.legal_doc import LegalDocument
        from app.models.crawl_log import CrawlLog
        from app.models.category import Category
        from app.models.company import Company
        from app.models.seo_metadata import SEOMetadata
        
        # Initialize Beanie with all models
        await init_beanie(
            database=database,
            document_models=[
                Article,
                LegalDocument,
                CrawlLog,
                Category,
                Company,
                SEOMetadata,
            ]
        )
        
        print(f"✅ Connected to MongoDB: {settings.MONGODB_DB_NAME}")
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection."""
    if db_manager.client:
        db_manager.client.close()
        print("✅ MongoDB connection closed")


# Alias for FastAPI lifespan
init_db = connect_to_mongo
close_db = close_mongo_connection


# Get database instance (for advanced queries)
def get_database():
    """Get MongoDB database instance."""
    if db_manager.client:
        return db_manager.client[settings.MONGODB_DB_NAME]
    return None
