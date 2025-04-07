"""
Minimal FastAPI application for debugging deployment issues.
This file has no dependencies on your current codebase.
"""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

# Create a minimal FastAPI app
app = FastAPI(title="ALU Chatbot (Minimal Version)")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Define a simple request model
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

# Basic routes
@app.get("/")
async def root():
    return {"message": "ALU Chatbot API is running (minimal version)"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Simple chat endpoint that always returns the same response.
    This is just to verify the API is working.
    """
    return {
        "response": f"This is a minimal working version. You sent: '{request.message}'",
        "source": "minimal_api"
    }

# Print debug information on startup
@app.on_event("startup")
async def startup_event():
    print(f"Starting minimal FastAPI app on port {os.environ.get('PORT', '8000')}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Environment variables: PORT={os.environ.get('PORT')}")