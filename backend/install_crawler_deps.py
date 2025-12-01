"""
Quick Installation Script for Crawler Dependencies
Run this after installing base requirements.txt
"""

import subprocess
import sys
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)


def run_command(command: str, description: str) -> bool:
    """Run a shell command and report results."""
    logger.info(f"Installing {description}...")
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        logger.info(f"✓ {description} installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"✗ Failed to install {description}")
        logger.error(f"Error: {e.stderr}")
        return False


def main():
    """Install all crawler dependencies."""
    logger.info("=" * 60)
    logger.info("Insurance News Crawler - Dependency Installation")
    logger.info("=" * 60)
    
    # Step 1: Install Python packages
    packages = [
        ("playwright", "Playwright"),
        ("beautifulsoup4", "BeautifulSoup4"),
        ("lxml", "LXML Parser"),
    ]
    
    for package, name in packages:
        if not run_command(f"pip install {package}", name):
            logger.error(f"Failed to install {name}. Exiting.")
            sys.exit(1)
    
    # Step 2: Install Playwright browsers
    logger.info("")
    logger.info("Installing Playwright browsers (Chromium)...")
    logger.info("This may take a few minutes on first run...")
    
    if not run_command("playwright install chromium", "Playwright Chromium browser"):
        logger.warning("Playwright browser installation failed.")
        logger.warning("You can try manually: playwright install chromium")
    
    # Success message
    logger.info("")
    logger.info("=" * 60)
    logger.info("✓ ALL DEPENDENCIES INSTALLED SUCCESSFULLY")
    logger.info("=" * 60)
    logger.info("")
    logger.info("Next steps:")
    logger.info("1. Test TVPL crawler:")
    logger.info("   python -m app.crawlers.tvpl_crawler_advanced")
    logger.info("")
    logger.info("2. Test News crawler:")
    logger.info("   python -m app.crawlers.news_crawler_advanced")
    logger.info("")
    logger.info("3. Run full pipeline:")
    logger.info("   python run_crawlers.py --module full")
    logger.info("")


if __name__ == "__main__":
    main()
