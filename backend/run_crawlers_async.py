"""
Async Crawler Runner for Insurance News Platform (MongoDB)
Executes both TVPL Legal Watchdog and News Aggregator with async database operations
"""

import asyncio
import logging
import sys
from datetime import datetime
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.crawlers.tvpl_crawler_advanced import TVPLAdvancedCrawler
from app.crawlers.news_crawler_advanced import NewsAggregatorAdvanced
from app.database import connect_to_mongo, close_mongo_connection
from app.services.content_processor_async import ContentProcessorAsync

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('crawler.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


class CrawlerEngineAsync:
    """Async crawler engine orchestrating both modules with MongoDB."""
    
    def __init__(self, use_playwright: bool = True):
        self.use_playwright = use_playwright
        self.tvpl_crawler = None
        self.news_crawler = None
        self.processor = None
    
    async def initialize(self):
        """Initialize crawlers and database connection."""
        logger.info("Initializing Async Crawler Engine...")
        
        # Connect to MongoDB
        await connect_to_mongo()
        
        # Initialize crawlers (sync operations)
        self.tvpl_crawler = TVPLAdvancedCrawler(use_playwright=self.use_playwright)
        self.news_crawler = NewsAggregatorAdvanced(use_playwright=self.use_playwright)
        
        # Initialize content processor
        self.processor = ContentProcessorAsync()
        
        logger.info("✓ Async Crawler Engine initialized")
    
    async def run_legal_watchdog(self, max_pages: int = 5):
        """
        Run Module A: TVPL Legal Watchdog
        
        Target: thuvienphapluat.vn
        Queries: Bảo hiểm, Kinh doanh bảo hiểm, Bộ Tài chính, Bảo hiểm xã hội
        Focus: Nghị định, Thông tư, Công văn
        """
        logger.info("=" * 80)
        logger.info("MODULE A: LEGAL WATCHDOG - Starting...")
        logger.info("=" * 80)
        
        try:
            if not self.tvpl_crawler:
                logger.error("TVPL Crawler not initialized")
                return []
            
            # Crawl documents (sync operation)
            documents = self.tvpl_crawler.crawl(max_pages=max_pages)
            
            logger.info(f"✓ Crawled {len(documents)} legal documents")
            
            # Process and save to database (async)
            if self.processor:
                result = await self.processor.process_legal_documents_from_data(documents)
                logger.info(f"✓ Processed {result.get('items_processed', 0)} documents to database")
            
            return documents
            
        except Exception as e:
            logger.error(f"✗ Legal Watchdog failed: {e}")
            return []
    
    async def run_news_aggregator(self, max_articles_per_source: int = 10):
        """
        Run Module B: News Aggregator
        
        Targets: CafeF, VnExpress, Company Press Releases
        Keywords: Bảo hiểm, Bồi thường, Lợi nhuận bảo hiểm, Phí bảo hiểm
        """
        logger.info("=" * 80)
        logger.info("MODULE B: NEWS AGGREGATOR - Starting...")
        logger.info("=" * 80)
        
        try:
            if not self.news_crawler:
                logger.error("News Crawler not initialized")
                return []
            
            # Crawl articles (sync operation)
            articles = self.news_crawler.crawl(
                sources=['cafef', 'vnexpress', 'baoviet', 'manulife'],
                max_articles_per_source=max_articles_per_source
            )
            
            logger.info(f"✓ Crawled {len(articles)} relevant news articles")
            
            # Process and save to database (async)
            if self.processor:
                result = await self.processor.process_news_articles_from_data(articles)
                logger.info(f"✓ Processed {result.get('items_processed', 0)} articles to database")
            
            return articles
            
        except Exception as e:
            logger.error(f"✗ News Aggregator failed: {e}")
            return []
    
    async def run_full_pipeline(self, legal_pages: int = 5, news_max: int = 10):
        """Run both modules in sequence."""
        logger.info("=" * 80)
        logger.info("INSURANCE NEWS CRAWLER ENGINE - FULL PIPELINE (ASYNC)")
        logger.info("=" * 80)
        logger.info(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info("")
        
        results = {
            'start_time': datetime.now(),
            'legal_docs': [],
            'news_articles': [],
            'errors': []
        }
        
        # Module A: Legal Watchdog
        try:
            results['legal_docs'] = await self.run_legal_watchdog(max_pages=legal_pages)
        except Exception as e:
            logger.error(f"Module A error: {e}")
            results['errors'].append(('legal_watchdog', str(e)))
        
        # Module B: News Aggregator
        try:
            results['news_articles'] = await self.run_news_aggregator(max_articles_per_source=news_max)
        except Exception as e:
            logger.error(f"Module B error: {e}")
            results['errors'].append(('news_aggregator', str(e)))
        
        results['end_time'] = datetime.now()
        results['duration'] = (results['end_time'] - results['start_time']).total_seconds()
        
        # Summary
        logger.info("")
        logger.info("=" * 80)
        logger.info("CRAWLER PIPELINE COMPLETE")
        logger.info("=" * 80)
        logger.info(f"Duration: {results['duration']:.2f} seconds")
        logger.info(f"Legal Documents: {len(results['legal_docs'])}")
        logger.info(f"News Articles: {len(results['news_articles'])}")
        logger.info(f"Errors: {len(results['errors'])}")
        logger.info("=" * 80)
        
        return results
    
    async def cleanup(self):
        """Cleanup resources."""
        if self.tvpl_crawler:
            self.tvpl_crawler.close()
        if self.news_crawler:
            self.news_crawler.close()
        
        # Close MongoDB connection
        await close_mongo_connection()
        
        logger.info("✓ Cleanup complete")


async def main():
    """Main async execution function."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Insurance News Crawler Engine (Async MongoDB)')
    parser.add_argument('--module', choices=['legal', 'news', 'full'], default='full',
                       help='Module to run: legal, news, or full pipeline')
    parser.add_argument('--legal-pages', type=int, default=5,
                       help='Max pages to crawl from TVPL (default: 5)')
    parser.add_argument('--news-max', type=int, default=10,
                       help='Max articles per news source (default: 10)')
    parser.add_argument('--no-playwright', action='store_true',
                       help='Disable Playwright (use requests only)')
    
    args = parser.parse_args()
    
    # Initialize engine
    engine = CrawlerEngineAsync(use_playwright=not args.no_playwright)
    
    try:
        await engine.initialize()
        
        if args.module == 'legal':
            await engine.run_legal_watchdog(max_pages=args.legal_pages)
        elif args.module == 'news':
            await engine.run_news_aggregator(max_articles_per_source=args.news_max)
        else:
            await engine.run_full_pipeline(
                legal_pages=args.legal_pages,
                news_max=args.news_max
            )
    
    except KeyboardInterrupt:
        logger.info("\n✗ Interrupted by user")
    except Exception as e:
        logger.error(f"✗ Fatal error: {e}", exc_info=True)
    finally:
        await engine.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
