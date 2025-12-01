"""
Unified Crawler Runner for Insurance News Platform
DEPRECATED: This file redirects to run_crawlers_async.py

For MongoDB async support, please use:
    python run_crawlers_async.py [options]

This file is kept for backward compatibility only.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import async version
from run_crawlers_async import main as async_main


def main():
    """Redirect to async version."""
    print("=" * 80)
    print("DEPRECATED: run_crawlers.py")
    print("=" * 80)
    print("This project now uses MongoDB with async operations.")
    print("Please use: python run_crawlers_async.py [options]")
    print("=" * 80)
    print("")
    print("Running async version automatically...")
    print("")
    
    # Run async version
    asyncio.run(async_main())


if __name__ == "__main__":
    main()
