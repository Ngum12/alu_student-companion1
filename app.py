"""
Entry point for Render deployment
"""
import os
import sys
import traceback
from pathlib import Path

# Print debug information
print(f"Starting application from app.py entry point")
print(f"Current working directory: {os.getcwd()}")

# Add backend directory to Python path
backend_dir = os.path.join(os.getcwd(), "backend")
sys.path.insert(0, backend_dir)
print(f"Added {backend_dir} to Python path")

try:
    # List files in backend directory for debugging
    print(f"Files in backend directory: {os.listdir(backend_dir) if os.path.exists(backend_dir) else 'Directory not found'}")
    
    # Import the FastAPI app from main.py in the backend directory
    from main import app
    print("Successfully imported app from backend/main.py")
    
except Exception as e:
    print(f"Error importing app: {str(e)}")
    print(traceback.format_exc())
    
    # Create a minimal fallback app if import fails
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI(title="ALU Chatbot (Fallback Mode)")
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    async def root():
        return {
            "message": "Fallback mode active. Backend import failed.",
            "error": str(e)
        }

    @app.get("/health")
    async def health():
        return {
            "status": "error", 
            "error": str(e),
            "traceback": traceback.format_exc()
        }

    @app.post("/api/chat")
    async def chat(request: dict):
        return {
            "response": "The backend is currently in fallback mode due to initialization errors. Please check server logs.",
            "source": "fallback"
        }

print("App entry point setup complete")