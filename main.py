from typing import Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from uuid import uuid4
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (change this in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated in-memory databases
tasks_db: Dict[str, dict] = {}
users_db: Dict[str, dict] = {}

# Task model
class Task(BaseModel):
    title: str
    description: str = "No description"
    createdAt: datetime = datetime.utcnow()
    deadline: datetime
    priority: str
    is_completed: bool = False

# User registration model
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    username: str
    password: str  # Plain text password (not recommended)

# User login model
class UserLogin(BaseModel):
    username: str
    password: str

# Register a new user
@app.post("/register")
async def register_user(user: UserRegister):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")

    user_id = str(uuid4())

    users_db[user.username] = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "username": user.username,
        "password": user.password,  # Storing plain text password (not secure)
    }
    
    return {"message": "Account created successfully!", "user_id": user_id}

# Login user
@app.post("/login")
async def login_user(user: UserLogin):
    if user.username not in users_db:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    stored_password = users_db[user.username]["password"]
    
    if user.password != stored_password:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    return {"message": "Login successful!", "username": user.username}
