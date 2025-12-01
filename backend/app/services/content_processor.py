"""
Content Processor - Wrapper for backward compatibility

⚠️ DEPRECATED: Old SQLAlchemy version moved to content_processor.py.old

This module now redirects to ContentProcessorAsync for MongoDB support.

Example:
    # Import async version
    from app.services.content_processor import ContentProcessorAsync
    
    # Use it
    processor = ContentProcessorAsync()
    await processor.process_legal_documents_from_data(documents)
"""

# Re-export the async version as the main class
from app.services.content_processor_async import ContentProcessorAsync

# Legacy class that raises deprecation warning
class ContentProcessor:
    """
    DEPRECATED: This class is no longer functional.
    Use ContentProcessorAsync instead.
    """
    
    def __init__(self, *args, **kwargs):
        raise DeprecationWarning(
            "\n" + "=" * 80 + "\n"
            "ContentProcessor (SQLAlchemy version) is DEPRECATED\n"
            "=" * 80 + "\n"
            "The old synchronous SQL-based processor is no longer compatible.\n\n"
            "Please use ContentProcessorAsync for MongoDB:\n\n"
            "    from app.services.content_processor_async import ContentProcessorAsync\n"
            "    processor = ContentProcessorAsync()\n"
            "    result = await processor.process_legal_documents_from_data(documents)\n\n"
            "=" * 80
        )


__all__ = ["ContentProcessorAsync", "ContentProcessor"]
