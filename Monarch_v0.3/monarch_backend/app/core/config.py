from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import Optional
import os

load_dotenv()

class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./monarch.db")

    # API Configuration
    PROJECT_NAME: str = "Monarch Backend API"
    API_V1_STR: str = "/api/v1"

settings = Settings()