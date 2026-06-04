import time
import hashlib
import hmac
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
from app.models.schemas import PodcastChannel, Episode

class PodcastIndexService:
    def __init__(self):
        self.base_url = "https://api.podcastindex.org/api/1.0"

    def _get_auth_headers(self) -> Dict[str, str]:
        key = settings.PODCAST_INDEX_KEY
        secret = settings.PODCAST_INDEX_SECRET

        if not key or not secret:
            return {}

        epoch = str(int(time.time()))
        hash_msg = key + secret + epoch
        sha1 = hmac.new(
            secret.encode("utf-8"),
            hash_msg.encode("utf-8"),
            hashlib.sha1
        ).hexdigest()

        return {
            "X-Auth-Key": key,
            "X-Auth-Date": epoch,
            "Authorization": sha1,
            "User-Agent": "ReadersPWA/1.0"
        }

    async def search_podcasts(self, query: str) -> List[PodcastChannel]:
        headers = self._get_auth_headers()
        
        # Fallback mocks if key is unconfigured
        if not headers:
            return self._get_mock_channels(query)

        async with httpx.AsyncClient() as client:
            try:
                url = f"{self.base_url}/search/byterm"
                resp = await client.get(url, params={"q": query}, headers=headers, timeout=10.0)
                if resp.status_code == 200:
                    data = resp.json()
                    feeds = data.get("feeds", [])
                    results = []
                    for f in feeds:
                        results.append(PodcastChannel(
                            id=str(f.get("id")),
                            title=f.get("title", "Untitled Podcast"),
                            author=f.get("author", "Unknown Host"),
                            description=f.get("description", "A fascinating audio show."),
                            artwork=f.get("artwork") or f.get("image") or f"https://picsum.photos/seed/pod_{f.get('id')}/300/300",
                            feedUrl=f.get("url", "")
                        ))
                    return results
            except Exception:
                pass
            return self._get_mock_channels(query)

    async def get_episodes(self, feed_id: str) -> List[Episode]:
        headers = self._get_auth_headers()
        
        if not headers or feed_id.startswith("mock_"):
            return self._get_mock_episodes(feed_id)

        async with httpx.AsyncClient() as client:
            try:
                # Find episodes by feed ID
                url = f"{self.base_url}/episodes/byfeedid"
                resp = await client.get(url, params={"id": feed_id}, headers=headers, timeout=10.0)
                if resp.status_code == 200:
                    data = resp.json()
                    items = data.get("items", [])
                    results = []
                    for i in items:
                        # Convert published date timestamp to string
                        pub_time = i.get("datePublished")
                        published_str = ""
                        if pub_time:
                            published_str = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(pub_time))
                        else:
                            published_str = "Recently"

                        artwork = i.get("feedImage") or i.get("image") or "https://picsum.photos/seed/epi/300/300"

                        results.append(Episode(
                            id=str(i.get("id")),
                            title=i.get("title", "Untitled Episode"),
                            show=i.get("feedTitle", "Podcast Show"),
                            artwork=artwork,
                            duration=int(i.get("duration") or 1800), # seconds
                            enclosureUrl=i.get("enclosureUrl", ""),
                            publishedAt=published_str
                        ))
                    return results
            except Exception:
                pass
            return self._get_mock_episodes(feed_id)

    def _get_mock_channels(self, query: str) -> List[PodcastChannel]:
        mocks = [
            PodcastChannel(
                id="mock_1",
                title="The Daily Tech Talk",
                author="Sarah Jenkins",
                description="Your daily briefing on technology trends, developer tools, and product design.",
                artwork="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=80",
                feedUrl="https://techcrunch.com/feed/"
            ),
            PodcastChannel(
                id="mock_2",
                title="Kenyan Chronicles",
                author="Kariuki Mwangi",
                description="Deep-dives into Kenyan history, culture, business growth, and inspiring stories from Nairobi.",
                artwork="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=300&q=80",
                feedUrl="https://nation.africa/rss.xml"
            ),
            PodcastChannel(
                id="mock_3",
                title="Classic Audio Readings",
                author="Public Domain Group",
                description="Narrative readings of the world's finest essays, classical philosophy, and ancient historical texts.",
                artwork="https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?auto=format&fit=crop&w=300&q=80",
                feedUrl="https://librivox.org/rss/1234"
            )
        ]
        if query:
            return [m for m in mocks if query.lower() in m.title.lower() or query.lower() in m.description.lower()]
        return mocks

    def _get_mock_episodes(self, feed_id: str) -> List[Episode]:
        # Generate some mock episodes corresponding to the channel
        show_name = "The Daily Tech Talk"
        artwork = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=80"
        
        if feed_id == "mock_2":
            show_name = "Kenyan Chronicles"
            artwork = "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=300&q=80"
        elif feed_id == "mock_3":
            show_name = "Classic Audio Readings"
            artwork = "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?auto=format&fit=crop&w=300&q=80"

        return [
            Episode(
                id=f"{feed_id}_ep1",
                title="The Future of AI and the Next-Gen Backends",
                show=show_name,
                artwork=artwork,
                duration=1845,
                enclosureUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                publishedAt="2026-06-03 12:00:00"
            ),
            Episode(
                id=f"{feed_id}_ep2",
                title="Designing clean API contracts and state syncing",
                show=show_name,
                artwork=artwork,
                duration=2310,
                enclosureUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                publishedAt="2026-06-02T10:30:00Z"
            ),
            Episode(
                id=f"{feed_id}_ep3",
                title="Sustainable software engineering and scale",
                show=show_name,
                artwork=artwork,
                duration=1520,
                enclosureUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                publishedAt="2026-05-30T15:45:00Z"
            )
        ]

podcast_index_service = PodcastIndexService()
