import asyncio
import sys
import logging

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.firebase import get_firebase_app
from app.db.postgres import init_db, close_db
from app.routers import health, users, auth, members, networks, role_requests

logger = logging.getLogger("mfg.main")

app = FastAPI(title="Multi-family Genealogy API")

origins = settings.cors_origins_list
logger.info(f"Allowed CORS Origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # 1. Fail-fast check for Firebase Admin SDK initialization
    try:
        get_firebase_app()
        print("[INFO] Firebase Admin SDK checked and ready at startup.")
    except Exception as e:
        print(f"[FATAL] Firebase Admin SDK startup failed: {e}")
        # Re-raise to prevent starting backend in broken auth state
        raise e

    # 2. Initialize PostgreSQL DB and create tables / seed data if needed
    try:
        await init_db()
        print("[INFO] PostgreSQL init_db completed.")
    except Exception as e:
        print(f"[WARN] Postgres init_db error: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

app.include_router(health.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(role_requests.router, prefix="/api")
app.include_router(members.router, prefix="/api")
app.include_router(networks.router, prefix="/api")

# To run: uvicorn app.main:app --reload --port 8001
