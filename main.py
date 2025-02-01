from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Simulated in-memory database
tasks_db = {}

# Task model
class Task(BaseModel):
    title: str
    description: str = "No description"
    createdAt: datetime
    deadline: datetime
    priority: str
    is_completed: bool

# Get all tasks
@app.get("/todos")
async def get_tasks():
    return list(tasks_db.values())

# Create a task
@app.post("/todos")
async def create_task(task: Task):
    task_id = str(uuid4())  
    task_data = task.dict()
    task_data["createdAt"] = task.createdAt.isoformat()
    task_data["deadline"] = task.deadline.isoformat()
    tasks_db[task_id] = task_data
    task_data["id"] = task_id  
    return task_data

# Update a task
@app.put("/todos/{task_id}")
async def update_task(task_id: str, task: Task):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")

    updated_task = task.dict()
    updated_task["id"] = task_id
    tasks_db[task_id] = updated_task
    return updated_task

# Delete a task
@app.delete("/todos/{task_id}")
async def delete_task(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")

    del tasks_db[task_id]
    return {"message": "Task deleted successfully"}
