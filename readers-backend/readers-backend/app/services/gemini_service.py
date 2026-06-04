import os
import json
import httpx
import google.generativeai as genai
from typing import List, Dict, Any, Optional
from app.config import settings
from app.models.schemas import Flashcard, Book
from app.services.gutendex import gutendex_service

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.active = False
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                self.active = True
            except Exception as e:
                print(f"Error configuring Gemini client: {str(e)}")

        self.generation_config = {
            "max_output_tokens": 500,
            "temperature": 0.7
        }

    async def get_summary(self, book_id: str, chapter: str) -> str:
        if not self.active:
            return f"This is a placeholder summary for {chapter} of Book #{book_id}. To generate real summaries, please configure GEMINI_API_KEY."

        # Enhance summary by looking up book title/author to give context
        book_title = f"Book ID {book_id}"
        try:
            book_obj = await gutendex_service.get_book_by_id(int(book_id))
            if book_obj:
                book_title = f"'{book_obj.title}' by {book_obj.author}"
        except Exception:
            pass

        prompt = (
            f"Write a concise, high-quality, professional summary of {chapter} (or the general overview if no chapter exists) "
            f"for the classic literary work: {book_title}. "
            "Highlight the core plot points, character motivations, and thematic significance. Keep the response under 150 words."
        )

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config
            )
            return response.text.strip()
        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                return "error_quota_exceeded"
            return f"Could not generate summary: {str(e)}"

    async def generate_flashcards(self, text: str) -> List[Flashcard]:
        default_flashcards = [
            Flashcard(front="Who wrote 'The Adventures of Sherlock Holmes'?", back="Sir Arthur Conan Doyle"),
            Flashcard(front="What is the primary setting of 'The Adventures of Sherlock Holmes'?", back="London, England, primarily 221B Baker Street")
        ]

        if not self.active or not text:
            return default_flashcards

        prompt = (
            "Analyze the following text and generate exactly 4 high-quality educational flashcards "
            "covering key vocabulary, concepts, or plot points. "
            "You MUST return the output as a valid JSON array of objects, where each object has "
            "exactly two fields: 'front' (the question or term) and 'back' (the answer or explanation). "
            "Do not include any markdown formatting or surrounding text, just the raw JSON array.\n\n"
            f"TEXT TO ANALYZE:\n{text}"
        )

        try:
            # We can use generation_config with response_mime_type="application/json"
            cfg = dict(self.generation_config)
            cfg["response_mime_type"] = "application/json"
            
            response = self.model.generate_content(
                prompt,
                generation_config=cfg
            )
            
            # Clean up potential markdown formatting if model didn't obey
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()

            cards_json = json.loads(clean_text)
            
            # If standard list
            if isinstance(cards_json, list):
                flashcards = []
                for item in cards_json:
                    flashcards.append(Flashcard(
                        front=item.get("front", "Question"),
                        back=item.get("back", "Answer")
                    ))
                return flashcards
            elif isinstance(cards_json, dict) and "flashcards" in cards_json:
                nodes = cards_json["flashcards"]
                return [Flashcard(front=n.get("front"), back=n.get("back")) for n in nodes]
        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                raise Exception("quota_exceeded")
            print(f"Error parsing Gemini response: {str(e)}")
            
        return default_flashcards

    async def get_recommendations(self, genres: List[str], history: List[str]) -> Dict[str, Any]:
        # Fetch trending books as recommendations list
        default_recs = await gutendex_service.get_trending_books()
        default_recs = default_recs[:3]

        if not self.active:
            return {
                "recommendations": default_recs,
                "reasoning": "Standard literary classics recommended because the Gemini AI engine is offline (or GEMINI_API_KEY is not defined)."
            }

        prompt = (
            f"The user loves the following genres: {', '.join(genres)}. "
            f"Their reading history includes the following authors and works: {', '.join(history)}. "
            "Identify 3 classic public domain books that they would love. "
            "For each book, identify its exact Gutenberg ID if you can guess it (or list a guess) and explain why you recommend it. "
            "You MUST output the response as a single JSON object matching this structure exactly:\n"
            "{\n"
            "  \"reasoning\": \"A short explanation of how these books match the profile.\",\n"
            "  \"books\": [\n"
            "    { \"id\": \"<Gutenberg ID string, e.g., 1342 for Pride and Prejudice or 11 for Alice in Wonderland>\", \"title\": \"<Book Title>\", \"author\": \"<Author Name>\", \"reason\": \"<Specific reason>\" }\n"
            "  ]\n"
            "}\n"
            "Only return raw JSON. Do not write anything else."
        )

        try:
            cfg = dict(self.generation_config)
            cfg["response_mime_type"] = "application/json"
            
            response = self.model.generate_content(
                prompt,
                generation_config=cfg
            )
            
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()

            resp_json = json.loads(clean_text)
            reasoning = resp_json.get("reasoning", "Recommended based on your preferences.")
            raw_books = resp_json.get("books", [])

            rec_books = []
            for rb in raw_books:
                gid = rb.get("id")
                # Try to load real book details from Gutendex using the ID
                try:
                    loaded_book = await gutendex_service.get_book_by_id(int(gid))
                    if loaded_book:
                        # Append it
                        # Override its description with the reasoning back from Gemini
                        loaded_book.description = rb.get("reason", loaded_book.description)
                        rec_books.append(loaded_book)
                        continue
                except Exception:
                    pass
                
                # If lookup fails or ID is bad, synthesize a classic Book object dynamically
                fallback_gid = hash(rb.get("title", "")) % 5000 + 1
                rec_books.append(Book(
                    id=str(gid or fallback_gid),
                    title=rb.get("title"),
                    author=rb.get("author", "Unknown Author"),
                    cover=f"https://picsum.photos/seed/rec_{gid or fallback_gid}/200/300",
                    rating=4.7,
                    price=0.0,
                    genre=genres,
                    description=rb.get("reason", "A highly recommended classic."),
                    pages=240,
                    readingTime=360,
                    formats=["epub", "html"],
                    gutendexId=int(gid) if str(gid).isdigit() else fallback_gid
                ))

            if not rec_books:
                rec_books = default_recs

            return {
                "recommendations": rec_books,
                "reasoning": reasoning
            }

        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                raise Exception("quota_exceeded")
            print(f"Error generating recommendations: {str(e)}")

        return {
            "recommendations": default_recs,
            "reasoning": "Recommended standard classics. AI recommendations are temporarily unavailable."
        }

    async def get_explanation(self, passage: str, context: str) -> str:
        if not self.active:
            return f"This is an offline explanation for: '{passage}'. Configure GEMINI_API_KEY to receive deep semantic breakdowns and historical context definitions using Gemini."

        prompt = (
            f"Explain this difficult vocabulary, word, or passage: '{passage}'\n"
            f"The context from the book page is:\n\"{context}\"\n\n"
            "Provide a friendly, highly clear explanation of about 2-3 sentences. "
            "Define the archaic or difficult terms and contextualize their usage. Keep the total response under 100 words."
        )

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config
            )
            return response.text.strip()
        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                return "error_quota_exceeded"
            return f"Error explaining passage: {str(e)}"

gemini_service = GeminiService()
