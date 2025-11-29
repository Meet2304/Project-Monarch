from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

# Base Project Schema
class ProjectBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None

# Schema for Project Creation
class ProjectCreate(ProjectBase):
    pass

# Schema for Project Read
class ProjectRead(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Schema for Project Update
class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None