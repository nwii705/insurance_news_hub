"""
Content Processor - Async version for MongoDB with Beanie ODM.
Processes crawled content through AI pipeline.
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.services.llm_service import LLMService, LLMProvider
from app.models.article import Article
from app.models.legal_doc import LegalDocument
from app.models.crawl_log import CrawlLog
from app.core.config import settings
from slugify import slugify

logger = logging.getLogger(__name__)


class ContentProcessorAsync:
    """Async content processor for MongoDB."""
    
    def __init__(self, llm_provider: LLMProvider = LLMProvider.OPENAI):
        """Initialize content processor with LLM service."""
        self.llm_service = LLMService(provider=llm_provider)
    
    async def process_legal_documents_from_data(self, documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process pre-crawled legal documents data.
        
        Args:
            documents: List of document dictionaries
            
        Returns:
            Processing results
        """
        # Create crawl log
        crawl_log = CrawlLog(
            source="TVPL_Advanced",
            crawl_type="legal_docs",
            status="started",
            items_found=len(documents)
        )
        await crawl_log.insert()  # type: ignore
        
        processed_count = 0
        
        try:
            for doc_data in documents:
                try:
                    doc_number = doc_data.get('doc_number')
                    if not doc_number:
                        continue
                    
                    # Check if document already exists
                    existing_doc = await LegalDocument.find_one(
                        LegalDocument.doc_number == doc_number
                    )
                    
                    if existing_doc:
                        logger.info(f"Document {doc_number} already exists, skipping...")
                        continue
                    
                    # Process with AI if enabled
                    content_summary = doc_data.get('content_summary') or doc_data.get('abstract')
                    if settings.AI_REWRITE_ENABLED and doc_data.get('content_full') and not content_summary:
                        summary_data = self.llm_service.summarize_legal_doc(
                            doc_title=doc_data.get('title', ''),
                            doc_content=doc_data.get('content_full', ''),
                            doc_number=doc_number
                        )
                        content_summary = summary_data.get('executive_summary', '')
                    
                    # Create legal document
                    issue_date = doc_data.get('issue_date')
                    if not issue_date:
                        # Use today's date if missing
                        from datetime import date
                        issue_date = date.today()
                    
                    legal_doc = LegalDocument(
                        doc_number=doc_number,
                        doc_type=doc_data.get('doc_type', 'Unknown'),
                        title=doc_data.get('title', ''),
                        issue_date=issue_date,
                        effective_date=doc_data.get('effective_date'),
                        signer=doc_data.get('signer'),
                        issuing_body=doc_data.get('issuing_body'),
                        content_summary=content_summary,
                        content_full=doc_data.get('content_full'),
                        original_link=doc_data.get('original_link', ''),
                        pdf_url=doc_data.get('pdf_url'),
                        tags=doc_data.get('tags', [])
                    )
                    
                    await legal_doc.insert()  # type: ignore
                    processed_count += 1
                    
                except Exception as e:
                    logger.error(f"Error processing document: {e}")
                    continue
            
            # Update crawl log
            crawl_log.items_processed = processed_count
            crawl_log.status = "completed"
            crawl_log.completed_at = datetime.utcnow()
            await crawl_log.save()  # type: ignore
            
            logger.info(f"Successfully processed {processed_count}/{len(documents)} legal documents")
            
            return {
                "status": "success",
                "items_found": len(documents),
                "items_processed": processed_count
            }
            
        except Exception as e:
            logger.error(f"Error in legal document processing: {e}")
            crawl_log.status = "failed"
            crawl_log.error_message = str(e)
            crawl_log.completed_at = datetime.utcnow()
            await crawl_log.save()  # type: ignore
            
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def process_news_articles_from_data(self, articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process pre-crawled news articles data.
        
        Args:
            articles: List of article dictionaries
            
        Returns:
            Processing results
        """
        # Create crawl log
        crawl_log = CrawlLog(
            source="NewsAggregator_Advanced",
            crawl_type="news_articles",
            status="started",
            items_found=len(articles)
        )
        await crawl_log.insert()  # type: ignore
        
        processed_count = 0
        
        try:
            for article_data in articles:
                try:
                    source_url = article_data.get('source_url')
                    if not source_url:
                        continue
                    
                    # Check if article already exists
                    existing_article = await Article.find_one(
                        Article.source_url == source_url
                    )
                    
                    if existing_article:
                        logger.info(f"Article from {source_url} already exists, skipping...")
                        continue
                    
                    # Get content
                    title = article_data.get('title', '')
                    content_html = article_data.get('content_html', '')
                    summary = article_data.get('summary', title[:200] if title else '')
                    
                    # Process with AI if enabled and content is available
                    if settings.AI_REWRITE_ENABLED and content_html and len(content_html) > 100:
                        try:
                            rewritten_data = self.llm_service.rewrite_article(
                                original_text=content_html,
                                title=title,
                                source=article_data.get('source_name', '')
                            )
                            
                            title = rewritten_data.get('title', title)
                            content_html = rewritten_data.get('content_html', content_html)
                            summary = rewritten_data.get('summary', summary)
                            
                            # Generate SEO metadata
                            seo_data = self.llm_service.generate_seo_metadata(title, content_html)
                            meta_title = seo_data.get('meta_title', title)
                            meta_description = seo_data.get('meta_description', summary)
                        except Exception as e:
                            logger.warning(f"AI processing failed, using original: {e}")
                            meta_title = title
                            meta_description = summary
                    else:
                        meta_title = title
                        meta_description = summary
                    
                    # Create article
                    article = Article(
                        title=title,
                        slug=slugify(title) if title else f"article-{datetime.utcnow().timestamp()}",
                        summary=summary,
                        content_html=content_html or f"<p>{summary}</p>",
                        source_url=source_url,
                        source_name=article_data.get('source_name'),
                        author_type='Bot',
                        disclaimer_level='Medium',
                        meta_title=meta_title,
                        meta_description=meta_description,
                        featured_image_url=article_data.get('featured_image_url'),
                        status='published' if settings.AUTO_PUBLISH_ENABLED else 'draft',
                        published_at=datetime.utcnow() if settings.AUTO_PUBLISH_ENABLED else None
                    )
                    
                    await article.insert()  # type: ignore
                    processed_count += 1
                    
                except Exception as e:
                    logger.error(f"Error processing article: {e}")
                    continue
            
            # Update crawl log
            crawl_log.items_processed = processed_count
            crawl_log.status = "completed"
            crawl_log.completed_at = datetime.utcnow()
            await crawl_log.save()  # type: ignore
            
            logger.info(f"Successfully processed {processed_count}/{len(articles)} articles")
            
            return {
                "status": "success",
                "items_found": len(articles),
                "items_processed": processed_count
            }
            
        except Exception as e:
            logger.error(f"Error in news article processing: {e}")
            crawl_log.status = "failed"
            crawl_log.error_message = str(e)
            crawl_log.completed_at = datetime.utcnow()
            await crawl_log.save()  # type: ignore
            
            return {
                "status": "error",
                "error": str(e)
            }
