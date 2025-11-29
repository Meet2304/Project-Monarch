from sqlmodel import create_engine, Session, SQLModel
from app.core.config import settings
from typing import Generator
from app.models.project import Project

# Connection Engine Instance
engine = create_engine(settings.DATABASE_URL, echo=True)
# echo=True enables SQL query logging in the console for debugging purposes

# Function to create database tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependency to provide a database session
def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session