import asyncio
import sys
import os

# Adjust path to import app correctly if running directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.rss_service import fetch_feeds, fetch_feed
from app.constants.rss_sources import RSS_SOURCES

async def main():
    print(f"Total sources configured: {len(RSS_SOURCES)}")
    for source in RSS_SOURCES:
        articles = await fetch_feed(source)
        status = f"OK ({len(articles)} articles)" if articles else "DEAD (0 articles)"
        print(f"  [{source['country']}] {source['name']:<45} {status}")

if __name__ == "__main__":
    asyncio.run(main())
