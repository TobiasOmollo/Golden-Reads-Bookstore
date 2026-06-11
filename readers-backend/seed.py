import os
import sys
import json

# Add readers-backend/readers-backend to python path for imports
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "readers-backend"))

from app.routers.auth import hash_password
from app.services.db import init_db, execute_query

def seed_data():
    print("Initializing Database tables...")
    init_db()

    print("Seeding Users...")
    user_sql = """
    INSERT INTO users (email, hashed_password, name, reading_goal, genres, preferred_formats, avatar)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (email) DO NOTHING
    """
    execute_query(user_sql, (
        "amara@goldenreads.app",
        hash_password("password"),
        "Amara Okonkwo",
        24,
        json.dumps(["Fiction", "Thriller", "Biography"]),
        json.dumps(["epub", "audio"]),
        "https://i.pravatar.cc/200?img=47"
    ), is_write=True)

    print("Seeding Books...")
    books = [
        ("g1342", "Pride and Prejudice", "Jane Austen", "https://covers.openlibrary.org/b/id/1342-L.jpg", "A classic romantic novel of manners written by Jane Austen in 1813.", "Fiction", 1342, "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm", "https://www.gutenberg.org/ebooks/1342.epub3.images", "https://www.gutenberg.org/files/1342/1342-0.txt"),
        ("g84", "Frankenstein; Or, The Modern Prometheus", "Mary Wollstonecraft Shelley", "https://covers.openlibrary.org/b/id/84-L.jpg", "A classic gothic horror novel written by Mary Shelley in 1818.", "Horror", 84, "https://www.gutenberg.org/files/84/84-h/84-h.htm", "https://www.gutenberg.org/ebooks/84.epub3.images", "https://www.gutenberg.org/files/84/84-0.txt"),
        ("g64317", "The Great Gatsby", "F. Scott Fitzgerald", "https://covers.openlibrary.org/b/id/64317-L.jpg", "A classic novel of the Jazz Age written by F. Scott Fitzgerald in 1925.", "Fiction", 64317, "https://www.gutenberg.org/files/64317/64317-h/64317-h.htm", "https://www.gutenberg.org/ebooks/64317.epub3.images", "https://www.gutenberg.org/files/64317/64317-0.txt"),
        ("g2701", "Moby Dick; Or, The Whale", "Herman Melville", "https://covers.openlibrary.org/b/id/2701-L.jpg", "A giant whale, a mad captain, and a classic tale of obsession.", "Adventure", 2701, "https://www.gutenberg.org/files/2701/2701-h/2701-h.htm", "https://www.gutenberg.org/ebooks/2701.epub3.images", "https://www.gutenberg.org/files/2701/2701-0.txt"),
        ("g1661", "The Adventures of Sherlock Holmes", "Arthur Conan Doyle", "https://covers.openlibrary.org/b/id/1661-L.jpg", "A collection of twelve detective stories by Arthur Conan Doyle.", "Mystery", 1661, "https://www.gutenberg.org/files/1661/1661-h/1661-h.htm", "https://www.gutenberg.org/ebooks/1661.epub3.images", "https://www.gutenberg.org/files/1661/1661-0.txt"),
        ("g11", "Alice's Adventures in Wonderland", "Lewis Carroll", "https://covers.openlibrary.org/b/id/11-L.jpg", "A classic fantasy tale of a girl falling down a rabbit hole.", "Fantasy", 11, "https://www.gutenberg.org/files/11/11-h/11-h.htm", "https://www.gutenberg.org/ebooks/11.epub3.images", "https://www.gutenberg.org/files/11/11-0.txt"),
        ("g98", "A Tale of Two Cities", "Charles Dickens", "https://covers.openlibrary.org/b/id/98-L.jpg", "A historical novel set in London and Paris during the French Revolution.", "History", 98, "https://www.gutenberg.org/files/98/98-h/98-h.htm", "https://www.gutenberg.org/ebooks/98.epub3.images", "https://www.gutenberg.org/files/98/98-0.txt"),
        ("g345", "Dracula", "Bram Stoker", "https://covers.openlibrary.org/b/id/345-L.jpg", "The classic gothic vampire novel written by Bram Stoker in 1897.", "Horror", 345, "https://www.gutenberg.org/files/345/345-h/345-h.htm", "https://www.gutenberg.org/ebooks/345.epub3.images", "https://www.gutenberg.org/files/345/345-0.txt"),
        ("g174", "The Picture of Dorian Gray", "Oscar Wilde", "https://covers.openlibrary.org/b/id/174-L.jpg", "A young man sells his soul for eternal youth and beauty.", "Fiction", 174, "https://www.gutenberg.org/files/174/174-h/174-h.htm", "https://www.gutenberg.org/ebooks/174.epub3.images", "https://www.gutenberg.org/files/174/174-0.txt"),
        ("g1260", "Jane Eyre", "Charlotte Brontë", "https://covers.openlibrary.org/b/id/1260-L.jpg", "A governess finds love and secrets in a gothic estate.", "Fiction", 1260, "https://www.gutenberg.org/files/1260/1260-h/1260-h.htm", "https://www.gutenberg.org/ebooks/1260.epub3.images", "https://www.gutenberg.org/files/1260/1260-0.txt"),
    ]
    
    book_sql = """
    INSERT INTO books (id, title, author, cover_url, description, genre, gutendex_id, read_url, epub_url, download_url)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING
    """
    for b in books:
        execute_query(book_sql, b, is_write=True)

    print("Seeding Audiobooks...")
    audiobooks = [
        ("a102", "The Adventures of Huckleberry Finn", "Mark Twain", "https://archive.org/services/img/102", 
         "Twain's classic story of Huck and Jim sailing down the Mississippi River.", 
         "https://www.archive.org/download/huck_finn_librivox/huck_finn_librivox_64kb_mp3.zip", 
         "https://librivox.org/rss/102", 
         json.dumps([{"id": "all", "title": "Play Full Audiobook", "duration": 3600, "listen_url": "https://www.archive.org/download/huck_finn_librivox/huck_finn_librivox_64kb_mp3.zip"}])),
        ("a282", "The Art of War", "Sun Tzu", "https://archive.org/services/img/282", 
         "The ancient Chinese military treatise attributed to Sun Tzu.", 
         "https://www.archive.org/download/art_of_war_librivox/art_of_war_librivox_64kb_mp3.zip", 
         "https://librivox.org/rss/282", 
         json.dumps([{"id": "all", "title": "Play Full Audiobook", "duration": 3600, "listen_url": "https://www.archive.org/download/art_of_war_librivox/art_of_war_librivox_64kb_mp3.zip"}])),
        ("a2125", "Frankenstein; or, The Modern Prometheus", "Mary Wollstonecraft Shelley", "https://archive.org/services/img/2125", 
         "A classic gothic horror narrative detailing Victor Frankenstein and his creature.", 
         "https://www.archive.org/download/frankenstein_0810_librivox/frankenstein_0810_librivox_64kb_mp3.zip", 
         "https://librivox.org/rss/2125", 
         json.dumps([{"id": "all", "title": "Play Full Audiobook", "duration": 3600, "listen_url": "https://www.archive.org/download/frankenstein_0810_librivox/frankenstein_0810_librivox_64kb_mp3.zip"}])),
        ("a1121", "Romeo and Juliet", "William Shakespeare", "https://archive.org/services/img/1121", 
         "Shakespeare's legendary tragedy of star-crossed lovers.", 
         "https://www.archive.org/download/romeo_juliet_librivox/romeo_juliet_librivox_64kb_mp3.zip", 
         "https://librivox.org/rss/1121", 
         json.dumps([{"id": "all", "title": "Play Full Audiobook", "duration": 3600, "listen_url": "https://www.archive.org/download/romeo_juliet_librivox/romeo_juliet_librivox_64kb_mp3.zip"}])),
        ("a981", "The Call of the Wild", "Jack London", "https://archive.org/services/img/981", 
         "The adventure of Buck, a sled dog in the Klondike Gold Rush.", 
         "https://www.archive.org/download/call_of_the_wild_librivox/call_of_the_wild_librivox_64kb_mp3.zip", 
         "https://librivox.org/rss/981", 
         json.dumps([{"id": "all", "title": "Play Full Audiobook", "duration": 3600, "listen_url": "https://www.archive.org/download/call_of_the_wild_librivox/call_of_the_wild_librivox_64kb_mp3.zip"}]))
    ]
    
    audio_sql = """
    INSERT INTO audiobooks (id, title, author, cover_url, description, listen_url, stream_url, chapters)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING
    """
    for a in audiobooks:
        execute_query(audio_sql, a, is_write=True)

    print("Seeding Magazines...")
    magazines = [
        ("m1", "Kenya's Silicon Savannah Sets Pace for Regional Tech Boom", "TechEast Africa", "KE", "technology",
         "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
         "Nairobi continues to consolidate its position as the premier technology hub in East Africa, attracting record venture capital investments.",
         "https://techeast.africa/silicon-savannah-tech-boom", "2026-06-10T08:00:00Z"),
        ("m2", "Central Bank of Kenya Holds Key Lending Rate Amid Inflation Drop", "Business Daily Africa", "KE", "business",
         "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
         "The monetary policy committee cited stable currency performance and falling food prices as the primary drivers behind the policy rate decision.",
         "https://businessdailyafrica.com/cbk-holds-rate", "2026-06-09T09:30:00Z"),
        ("m3", "Rwanda's Green Transition: Lessons in Urban Sustainability", "The EastAfrican", "RW", "general",
         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
         "Kigali's innovative car-free zones and extensive waste-to-energy projects provide a scalable model for other emerging cities.",
         "https://theeastafrican.co.ke/rwanda-green-transition", "2026-06-08T11:00:00Z"),
        ("m4", "The Rise of Specialized Coffee Farming in Mount Elgon, Uganda", "Daily Monitor", "UG", "general",
         "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80",
         "Local smallholder cooperatives are bypassing middlemen, earning premium prices by exporting directly to specialty European roasters.",
         "https://monitor.co.ug/uganda-specialized-coffee-farming", "2026-06-07T14:15:00Z"),
        ("m5", "Exploring the Rich Cultural Heritage of Lamu Cultural Festival", "Capital FM Lifestyle", "KE", "lifestyle",
         "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
         "The annual festival highlights Swahili culture through traditional dhow races, donkey competitions, and classic musical performances.",
         "https://capitalfm.co.ke/lamu-festival-celebration", "2026-06-06T16:00:00Z")
    ]

    mag_sql = """
    INSERT INTO magazines (id, title, publication, country, category, hero_image, summary, source_url, published_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING
    """
    for m in magazines:
        execute_query(mag_sql, m, is_write=True)

    print("Seed process completed successfully!")

if __name__ == "__main__":
    seed_data()
