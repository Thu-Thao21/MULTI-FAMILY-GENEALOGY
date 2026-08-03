import logging
import os
from typing import Any, Dict

import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from app.core.config import settings

logger = logging.getLogger("mfg.firebase")

_firebase_app = None


def get_firebase_app():
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    if firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app

    emulator_host = settings.FIREBASE_AUTH_EMULATOR_HOST or os.getenv("FIREBASE_AUTH_EMULATOR_HOST")
    cred_path = settings.FIREBASE_CREDENTIALS_PATH or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        _firebase_app = firebase_admin.initialize_app(cred)
        logger.info(f"Firebase Admin SDK initialized with certificate: {cred_path}")
        return _firebase_app

    if emulator_host:
        os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = emulator_host
        _firebase_app = firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
        logger.info(f"Firebase Admin SDK initialized with Auth Emulator: {emulator_host}")
        return _firebase_app

    try:
        # Try Application Default Credentials (ADC)
        _firebase_app = firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
        logger.info(f"Firebase Admin SDK initialized with ADC (Project ID: {settings.FIREBASE_PROJECT_ID})")
        return _firebase_app
    except Exception as e:
        logger.error(f"Firebase Admin initialization error: {e}")
        raise RuntimeError(
            "Firebase Admin SDK chưa được cấu hình credential hợp lệ (FIREBASE_CREDENTIALS_PATH / GOOGLE_APPLICATION_CREDENTIALS) "
            "và FIREBASE_AUTH_EMULATOR_HOST không được bật. Vui lòng cung cấp Service Account Key JSON để bảo mật."
        )


def verify_firebase_token(id_token: str) -> Dict[str, Any]:
    """
    Verifies a Firebase ID token sent from Frontend using official Firebase Admin SDK.
    Strictly verifies token signature, issuer, audience and revocation state.
    Raises ValueError on invalid/expired token.
    """
    app = get_firebase_app()
    try:
        decoded = firebase_auth.verify_id_token(
            id_token,
            app=app,
            check_revoked=True,
            clock_skew_seconds=10
        )
        return decoded
    except firebase_auth.RevokedIdTokenError:
        logger.warning("Firebase token has been revoked.")
        raise ValueError("Token đã bị thu hồi.")
    except firebase_auth.ExpiredIdTokenError:
        logger.warning("Firebase token has expired.")
        raise ValueError("Token đã hết hạn.")
    except Exception as err:
        logger.error(f"Firebase token verification failed: {err}")
        raise ValueError(f"Xác thực Firebase Token thất bại: {err}")
