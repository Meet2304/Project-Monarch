from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from datetime import datetime, timezone

router = APIRouter()

#1. Create a new project
@router.post("/", response_model = ProjectRead)
def create_project(*, session: Session = Depends(get_db), project: ProjectCreate):
    db_project = Project.model_validate(project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

#2. Read all projects
@router.get("/", response_model = List[ProjectRead])
def read_projects(*, session: Session = Depends(get_db),
                  offset: int=0, limit: int=100):
    projects = session.exec(select(Project).offset(offset).limit(limit)).all()
    return projects

#3. Read a specific project by ID
@router.get("/{project_id}", response_model = ProjectRead)
def read_project(*, session: Session = Depends(get_db), project_id : int):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

#4. Update a specific project by ID
@router.patch("/{project_id}", response_model=ProjectRead)
def update_project(*, session: Session = Depends(get_db), project_id: int, project_update: ProjectUpdate):

    #1. Find the project
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    #2. Calculate which data was actually sent by the user
    project_data = project_update.model_dump(exclude_unset=True)

    #3. Update the database with new data:
    for key, value in project_data.items():
        setattr(db_project, key, value)
    
    # manually update the updated_at field
    db_project.updated_at = datetime.now(timezone.utc)

    #5. Save to DB
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

#5. Delete a specific project by ID
@router.delete("/{project_id}")
def delete_project(*, session: Session = Depends(get_db), project_id: int):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    return {"ok": True}

