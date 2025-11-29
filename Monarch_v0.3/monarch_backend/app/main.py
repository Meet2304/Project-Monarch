from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import create_db_and_tables
from app.core.config import settings
from contextlib import asynccontextmanager
from app.api.endpoints import projects

# def on_startup():
#     print('Starting up... Creating database tables if they do not exist.')
#     create_db_and_tables()

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(
    title = "Monarch Backend API",
    description = "Backend API for managing project costs, scenarios and components",
    version = "0.1.1",
    lifespan=lifespan
)

# Defining allowed origins for CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix = "/projects", tags = ["projects"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Monarch! Backend API is up and running."}
