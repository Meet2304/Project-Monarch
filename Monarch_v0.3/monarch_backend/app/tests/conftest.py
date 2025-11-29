import pytest
from typing import Generator
from sqlmodel import SQLModel, create_engine, Session
from app.db.session import get_db
from app.main import app
from fastapi.testclient import TestClient
from sqlmodel.pool import StaticPool

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# StaticPool is used to ensure the same connection is used throughout the tests
engine = create_engine(
    sqlite_url, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

@pytest.fixture(name="session")
def session_fixture():
    """
    Creates a new database session for a test
    Creates all tables before the test and drops them after the test
    """

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    """
    Creates a Test client that uses the overridden database session
    """
    def get_session_override():
        return session
    
    app.dependency_overrides[get_db] = get_session_override

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()