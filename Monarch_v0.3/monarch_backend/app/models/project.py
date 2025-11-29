from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime, timezone
from app.schemas.project import ProjectBase

# Helper function to get current UTC time
def get_utc_now():
    return datetime.now(timezone.utc)

# Project class that defines the database table

class Project(ProjectBase, table=True):
    # Primary key definition
    id: Optional[int] = Field(default = None, primary_key = True)
    created_at: datetime = Field(default_factory=get_utc_now, nullable=False)
    updated_at: datetime = Field(default_factory=get_utc_now, nullable=False)

