import os
import json
import sqlite3
from psycopg2.extras import RealDictCursor
from app.database import engine
from app.config import settings

def get_connection():
    conn = engine.raw_connection()
    if engine.dialect.name == "sqlite":
        dbapi_conn = getattr(conn, "driver_connection", None) or getattr(conn, "connection", conn)
        dbapi_conn.row_factory = sqlite3.Row
    return conn

def execute_query(query: str, params: tuple = (), is_write: bool = False):
    conn = get_connection()
    try:
        if engine.dialect.name == "postgresql":
            # PostgreSQL
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                if is_write:
                    conn.commit()
                    return None
                else:
                    return [dict(row) for row in cur.fetchall()]
        else:
            # SQLite
            sqlite_query = query.replace("%s", "?")
            cur = conn.cursor()
            cur.execute(sqlite_query, params)
            if is_write:
                conn.commit()
                return None
            else:
                rows = cur.fetchall()
                return [dict(row) for row in rows]
    except Exception as e:
        if is_write:
            conn.rollback()
        raise e
    finally:
        conn.close()

def init_db():
    from app.database import Base
    from app.models import User, SeededBook, SeededAudiobook, SeededMagazine
    Base.metadata.create_all(bind=engine)

