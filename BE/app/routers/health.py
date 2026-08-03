from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import get_db
from app.core.firebase import get_firebase_app

router = APIRouter()


@router.get("/health")
async def health():
    """Liveness probe: Returns 200 OK if service process is running."""
    return {"status": "ok"}


@router.get("/readiness")
async def readiness(db: AsyncSession = Depends(get_db)):
    """
    Readiness probe: Checks PostgreSQL connection and Firebase Admin SDK status.
    Returns 200 OK if system is ready to handle requests, 503 if dependencies fail.
    """
    db_status = "ok"
    firebase_status = "ok"
    errors = []

    # 1. Test PostgreSQL DB query
    try:
        await db.execute(text("SELECT 1;"))
    except Exception as e:
        db_status = "error"
        errors.append(f"Database error: {str(e)}")

    # 2. Test Firebase Admin App
    try:
        fb_app = get_firebase_app()
        if not fb_app:
            firebase_status = "error"
            errors.append("Firebase Admin App is null")
    except Exception as e:
        firebase_status = "error"
        errors.append(f"Firebase error: {str(e)}")

    if db_status != "ok" or firebase_status != "ok":
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "unhealthy",
                "database": db_status,
                "firebase": firebase_status,
                "errors": errors,
            },
        )

    return {
        "status": "ready",
        "database": db_status,
        "firebase": firebase_status,
    }
