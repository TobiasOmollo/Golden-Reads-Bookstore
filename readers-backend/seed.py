import os
import sys
import json
import httpx
import re

# Add readers-backend/readers-backend to python path for imports
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "readers-backend"))

from app.routers.auth import hash_password
from app.services.db import init_db, execute_query
from app.config import settings

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')

def seed_data():
    print("Initializing Database tables...")
    init_db()

    print("Ensuring DB schema has price column...")
    try:
        execute_query("ALTER TABLE books ADD COLUMN price VARCHAR(50)", is_write=True)
        print("Successfully ensured price column exists.")
    except Exception as e:
        print("Price column already exists or skipped:", e)

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

    print("Defining Public Domain Classics (Gutendex)...")
    gutendex_books = [
        # Fiction
        {"id": 1342, "genre": "Fiction", "title": "Pride and Prejudice", "author": "Jane Austen"},
        {"id": 84, "genre": "Fiction", "title": "Frankenstein; Or, The Modern Prometheus", "author": "Mary Wollstonecraft Shelley"},
        {"id": 345, "genre": "Fiction", "title": "Dracula", "author": "Bram Stoker"},
        {"id": 174, "genre": "Fiction", "title": "The Picture of Dorian Gray", "author": "Oscar Wilde"},
        {"id": 11, "genre": "Fiction", "title": "Alice's Adventures in Wonderland", "author": "Lewis Carroll"},
        {"id": 1260, "genre": "Fiction", "title": "Jane Eyre", "author": "Charlotte Brontë"},
        {"id": 98, "genre": "Fiction", "title": "A Tale of Two Cities", "author": "Charles Dickens"},
        {"id": 2701, "genre": "Fiction", "title": "Moby Dick; Or, The Whale", "author": "Herman Melville"},
        {"id": 64317, "genre": "Fiction", "title": "The Great Gatsby", "author": "F. Scott Fitzgerald"},
        {"id": 768, "genre": "Fiction", "title": "Wuthering Heights", "author": "Emily Brontë"},
        {"id": 1184, "genre": "Fiction", "title": "The Count of Monte Cristo", "author": "Alexandre Dumas"},
        {"id": 135, "genre": "Fiction", "title": "Les Misérables", "author": "Victor Hugo"},
        {"id": 1399, "genre": "Fiction", "title": "Anna Karenina", "author": "Leo Tolstoy"},
        {"id": 2600, "genre": "Fiction", "title": "War and Peace", "author": "Leo Tolstoy"},
        {"id": 2554, "genre": "Fiction", "title": "Crime and Punishment", "author": "Fyodor Dostoyevsky"},
        # Mystery
        {"id": 1661, "genre": "Mystery", "title": "The Adventures of Sherlock Holmes", "author": "Arthur Conan Doyle"},
        {"id": 2852, "genre": "Mystery", "title": "The Hound of the Baskervilles", "author": "Arthur Conan Doyle"},
        {"id": 61262, "genre": "Mystery", "title": "And Then There Were None", "author": "Agatha Christie"},
        {"id": 863, "genre": "Mystery", "title": "The Mysterious Affair at Styles", "author": "Agatha Christie"},
        {"id": 3154, "genre": "Mystery", "title": "The Big Sleep", "author": "Raymond Chandler"},
        # Romance
        {"id": 161, "genre": "Romance", "title": "Sense and Sensibility", "author": "Jane Austen"},
        {"id": 158, "genre": "Romance", "title": "Emma", "author": "Jane Austen"},
        {"id": 105, "genre": "Romance", "title": "Persuasion", "author": "Jane Austen"},
        {"id": 4276, "genre": "Romance", "title": "North and South", "author": "Elizabeth Gaskell"},
        {"id": 514, "genre": "Romance", "title": "Little Women", "author": "Louisa May Alcott"},
        # History and Biography
        {"id": 132, "genre": "History and Biography", "title": "The Art of War", "author": "Sun Tzu"},
        {"id": 2680, "genre": "History and Biography", "title": "Meditations", "author": "Marcus Aurelius"},
        {"id": 1232, "genre": "History and Biography", "title": "The Prince", "author": "Niccolò Machiavelli"},
        {"id": 148, "genre": "History and Biography", "title": "Autobiography of Benjamin Franklin", "author": "Benjamin Franklin"},
        {"id": 2376, "genre": "History and Biography", "title": "Up From Slavery: An Autobiography", "author": "Booker T. Washington"},
        # Science Fiction
        {"id": 35, "genre": "Science Fiction", "title": "The Time Machine", "author": "H. G. Wells"},
        {"id": 36, "genre": "Science Fiction", "title": "The War of the Worlds", "author": "H. G. Wells"},
        {"id": 164, "genre": "Science Fiction", "title": "Twenty Thousand Leagues Under the Sea", "author": "Jules Verne"},
        {"id": 5230, "genre": "Science Fiction", "title": "The Invisible Man", "author": "H. G. Wells"},
        {"id": 103, "genre": "Science Fiction", "title": "Around the World in Eighty Days", "author": "Jules Verne"}
    ]

    print("Fetching and Seeding Gutendex Books...")
    for item in gutendex_books:
        gid = item["id"]
        genre = item["genre"]
        fallback_title = item["title"]
        fallback_author = item["author"]
        
        # Check if already exists by title
        existing = execute_query("SELECT id FROM books WHERE title = %s", (fallback_title,))
        if existing:
            # Update price anyway
            execute_query("UPDATE books SET price = %s WHERE title = %s", ("Ksh. 100", fallback_title), is_write=True)
            print(f"Book '{fallback_title}' already exists. Updated price to Ksh. 100.")
            continue
            
        print(f"Fetching Gutendex ID {gid}...")
        url = f"https://gutendex.com/books/{gid}"
        book_data = None
        try:
            resp = httpx.get(url, timeout=5.0)
            if resp.status_code == 200:
                book_data = resp.json()
            else:
                print(f"Failed to fetch Gutendex ID {gid}, status: {resp.status_code}. Using dynamic fallback.")
        except Exception as e:
            print(f"Error fetching Gutendex ID {gid}: {e}. Using dynamic fallback.")

        if book_data:
            title = book_data.get("title", fallback_title)
            
            # Handle author parsing (convert "Last, First" to "First Last")
            authors_raw = book_data.get("authors", [])
            author = fallback_author
            if authors_raw:
                author_name = authors_raw[0].get("name", fallback_author)
                if "," in author_name:
                    parts = author_name.split(",")
                    author = f"{parts[1].strip()} {parts[0].strip()}"
                else:
                    author = author_name

            formats = book_data.get("formats", {})
            cover_url = formats.get("image/jpeg", "")
            if cover_url.startswith("http://"):
                cover_url = cover_url.replace("http://", "https://")
            if not cover_url:
                cover_url = f"https://www.gutenberg.org/cache/epub/{gid}/pg{gid}.cover.medium.jpg"

            subjects = book_data.get("subjects", [])
            description = ", ".join(subjects) if subjects else "A classic public domain book."

            read_url = formats.get("text/html", "") or formats.get("text/plain", "")
            if read_url.startswith("http://"):
                read_url = read_url.replace("http://", "https://")
                
            epub_url = formats.get("application/epub+zip", "")
            if epub_url.startswith("http://"):
                epub_url = epub_url.replace("http://", "https://")
                
            download_url = formats.get("text/plain; charset=utf-8") or formats.get("text/plain") or ""
            if download_url.startswith("http://"):
                download_url = download_url.replace("http://", "https://")
        else:
            # Dynamic Fallback: Construct standard Gutenberg URLs dynamically
            title = fallback_title
            author = fallback_author
            cover_url = f"https://www.gutenberg.org/cache/epub/{gid}/pg{gid}.cover.medium.jpg"
            description = "A classic Gutenberg public domain book."
            read_url = f"https://www.gutenberg.org/files/{gid}/{gid}-h/{gid}-h.htm"
            epub_url = f"https://www.gutenberg.org/ebooks/{gid}.epub3.images"
            download_url = f"https://www.gutenberg.org/files/{gid}/{gid}-0.txt"

        price = "Ksh. 100"
        db_id = f"g{gid}"

        # Double check idempotency on title field (in case the fetched title is slightly different)
        existing_fetched = execute_query("SELECT id FROM books WHERE title = %s", (title,))
        if existing_fetched:
            execute_query(
                "UPDATE books SET price = %s, cover_url = %s, read_url = %s, epub_url = %s, download_url = %s WHERE title = %s",
                (price, cover_url, read_url, epub_url, download_url, title),
                is_write=True
            )
            print(f"Book '{title}' already exists. Updated price to {price} and live links.")
        else:
            # Insert new book
            execute_query(
                """
                INSERT INTO books (id, title, author, cover_url, description, genre, gutendex_id, read_url, epub_url, download_url, price)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (db_id, title, author, cover_url, description, genre, gid, read_url, epub_url, download_url, price),
                is_write=True
            )
            print(f"Inserted Gutendex book: '{title}' ({genre})")

    print("Defining Modern Bestsellers (Google Books)...")
    google_books = [
        # Fiction
        {"title": "The Midnight Library", "author": "Matt Haig", "genre": "Fiction"},
        {"title": "The Seven Husbands of Evelyn Hugo", "author": "Taylor Jenkins Reid", "genre": "Fiction"},
        {"title": "Where the Crawdads Sing", "author": "Delia Owens", "genre": "Fiction"},
        {"title": "Normal People", "author": "Sally Rooney", "genre": "Fiction"},
        {"title": "Lessons in Chemistry", "author": "Bonnie Garmus", "genre": "Fiction"},
        # Thriller
        {"title": "The Silent Patient", "author": "Alex Michaelides", "genre": "Thriller"},
        {"title": "Gone Girl", "author": "Gillian Flynn", "genre": "Thriller"},
        {"title": "The Girl with the Dragon Tattoo", "author": "Stieg Larsson", "genre": "Thriller"},
        {"title": "The Da Vinci Code", "author": "Dan Brown", "genre": "Thriller"},
        {"title": "Verity", "author": "Colleen Hoover", "genre": "Thriller"},
        # Self-Help and Business
        {"title": "Atomic Habits", "author": "James Clear", "genre": "Self-Help and Business"},
        {"title": "The Psychology of Money", "author": "Morgan Housel", "genre": "Self-Help and Business"},
        {"title": "Zero to One", "author": "Peter Thiel", "genre": "Self-Help and Business"},
        {"title": "Thinking Fast and Slow", "author": "Daniel Kahneman", "genre": "Self-Help and Business"},
        {"title": "Start With Why", "author": "Simon Sinek", "genre": "Self-Help and Business"},
        # Technology
        {"title": "The Coming Wave", "author": "Mustafa Suleyman", "genre": "Technology"},
        {"title": "Chip War", "author": "Chris Miller", "genre": "Technology"},
        {"title": "Life 3.0", "author": "Max Tegmark", "genre": "Technology"},
        {"title": "The Innovators", "author": "Walter Isaacson", "genre": "Technology"},
        {"title": "Weapons of Math Destruction", "author": "Cathy O'Neil", "genre": "Technology"},
        # Biography
        {"title": "Becoming", "author": "Michelle Obama", "genre": "Biography"},
        {"title": "Educated", "author": "Tara Westover", "genre": "Biography"},
        {"title": "Born a Crime", "author": "Trevor Noah", "genre": "Biography"},
        {"title": "Shoe Dog", "author": "Phil Knight", "genre": "Biography"},
        {"title": "Spare", "author": "Prince Harry", "genre": "Biography"}
    ]

    print("Fetching and Seeding Google Books...")
    for item in google_books:
        title = item["title"]
        author = item["author"]
        genre = item["genre"]
        
        # Check if already exists by title first to avoid unnecessary API call
        existing = execute_query("SELECT id FROM books WHERE title = %s", (title,))
        if existing:
            # Update price anyway
            execute_query("UPDATE books SET price = %s WHERE title = %s", ("Ksh. 200", title), is_write=True)
            print(f"Book '{title}' already exists. Updated price to Ksh. 200.")
            continue
            
        print(f"Fetching Google Book: '{title}' by {author}...")
        url = "https://www.googleapis.com/books/v1/volumes"
        params = {"q": f"intitle:{title} inauthor:{author}"}
        if settings.GEMINI_API_KEY and not settings.GEMINI_API_KEY.startswith("your") and "MY_GEMINI" not in settings.GEMINI_API_KEY:
            params["key"] = settings.GEMINI_API_KEY
            
        volume_info = None
        google_id = None
        try:
            resp = httpx.get(url, params=params, timeout=15.0)
            if resp.status_code == 200:
                results = resp.json().get("items", [])
                if results:
                    volume_info = results[0].get("volumeInfo", {})
                    google_id = results[0].get("id")
            if not volume_info:
                # Try fallback search with just intitle
                params_fallback = {"q": f"intitle:{title}"}
                if settings.GEMINI_API_KEY and not settings.GEMINI_API_KEY.startswith("your") and "MY_GEMINI" not in settings.GEMINI_API_KEY:
                    params_fallback["key"] = settings.GEMINI_API_KEY
                resp = httpx.get(url, params=params_fallback, timeout=15.0)
                if resp.status_code == 200:
                    results = resp.json().get("items", [])
                    if results:
                        volume_info = results[0].get("volumeInfo", {})
                        google_id = results[0].get("id")
        except Exception as e:
            print(f"Error fetching Google book '{title}': {e}")
            
        # Parse fields with fallbacks
        if volume_info:
            fetched_title = volume_info.get("title", title)
            fetched_authors = volume_info.get("authors", [])
            fetched_author = ", ".join(fetched_authors) if fetched_authors else author
            
            image_links = volume_info.get("imageLinks", {})
            cover_url = image_links.get("thumbnail") or image_links.get("smallThumbnail") or ""
            if cover_url.startswith("http://"):
                cover_url = cover_url.replace("http://", "https://")
                
            description = volume_info.get("description", "A modern bestseller.")
            read_url = volume_info.get("previewLink", "")
            if read_url.startswith("http://"):
                read_url = read_url.replace("http://", "https://")
        else:
            fetched_title = title
            fetched_author = author
            cover_url = ""
            description = "A modern bestseller."
            read_url = ""
            google_id = f"fallback_{slugify(title)}"
            
        if not cover_url:
            title_slug = slugify(fetched_title)
            cover_url = f"https://picsum.photos/seed/book_{title_slug}/200/300"
            
        db_id = f"gb{google_id}"
        price = "Ksh. 200"
        
        # Double check existence by fetched_title (in case the query matched a slightly different title already in DB)
        existing_fetched = execute_query("SELECT id FROM books WHERE title = %s", (fetched_title,))
        if existing_fetched:
            execute_query("UPDATE books SET price = %s, cover_url = %s, read_url = %s WHERE title = %s", (price, cover_url, read_url, fetched_title), is_write=True)
            print(f"Book '{fetched_title}' already exists. Updated price to {price} and live links.")
        else:
            execute_query(
                """
                INSERT INTO books (id, title, author, cover_url, description, genre, gutendex_id, read_url, epub_url, download_url, price)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (db_id, fetched_title, fetched_author, cover_url, description, genre, None, read_url, "", "", price),
                is_write=True
            )
            print(f"Inserted Google Book: '{fetched_title}' ({genre})")

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
