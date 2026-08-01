import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/multi_family_db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

if not settings.DATABASE_URL:
    settings.DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/multi_family_db"

if os.getenv("DATABASE_URL"):
    settings.DATABASE_URL = os.getenv("DATABASE_URL")
