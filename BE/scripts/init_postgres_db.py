import asyncio
import os
import sys
from urllib.parse import urlparse

import psycopg
from psycopg.errors import DuplicateDatabase

# Add BE root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.db.postgres import init_db


def create_database_if_not_exists():
    raw_url = settings.DATABASE_URL
    # Remove driver prefix for psycopg connection parsing
    clean_url = raw_url.replace("postgresql+psycopg://", "postgresql://")
    parsed = urlparse(clean_url)

    db_name = parsed.path.lstrip("/") or "multi_family_db"
    user = parsed.username or "postgres"
    password = parsed.password or ""
    host = parsed.hostname or "localhost"
    port = parsed.port or 5432

    print(f"[*] Checking PostgreSQL connection on {host}:{port} with user '{user}'...")

    try:
        # Connect to system 'postgres' database first to ensure db exists
        conn = psycopg.connect(
            dbname="postgres",
            user=user,
            password=password,
            host=host,
            port=port,
            autocommit=True,
            connect_timeout=5,
        )
        print(f"[+] Successfully authenticated with PostgreSQL server!")

        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
            exists = cur.fetchone()
            if not exists:
                print(f"[*] Database '{db_name}' does not exist. Creating database '{db_name}'...")
                cur.execute(f'CREATE DATABASE "{db_name}"')
                print(f"[+] Database '{db_name}' created successfully!")
            else:
                print(f"[+] Database '{db_name}' already exists.")
        conn.close()
        return True
    except Exception as e:
        print(f"[!] PostgreSQL Connection Error: {e}")
        return False


async def main():
    if not create_database_if_not_exists():
        print("[!] Could not connect to PostgreSQL. Please verify credentials in BE/.env")
        sys.exit(1)

    print("[*] Creating tables and inserting seed data...")
    try:
        await init_db()
        print("[+] SUCCESS: All database tables created and seed data initialized successfully!")
    except Exception as e:
        print(f"[!] Error during table initialization: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
