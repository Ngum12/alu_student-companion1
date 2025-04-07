"""
Robust entry point for Render deployment that handles errors gracefully.
"""
import os
import sys
import traceback
from pathlib import Path

# Add project paths to Python path
current_dir = Path(__file__).parent.absolute()
backend_dir = current_dir / "backend"
sys.path.insert(0, str(current_dir))
sys.path.insert(0, str(backend_dir))

# Create a minimal working FastAPI app as fallback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

# This will be our fallback app if the main app fails to load
fallback_app = FastAPI(title="ALU Chatbot (Fallback Mode)")
fallback_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

@fallback_app.get("/health")
def health_check():
    return {"status": "ok", "mode": "fallback"}

@fallback_app.post("/api/chat")
async def fallback_chat(request: ChatRequest):
    return {
        "response": "The full application failed to start. This is a minimal fallback mode. Please check the server logs.",
        "source": "fallback"
    }

# Try to import the real app, use fallback if it fails
try:
    print("Attempting to import the main FastAPI app...")
    
    # Save original stdout and stderr
    import io
    original_stdout = sys.stdout
    original_stderr = sys.stderr
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()
    sys.stdout = stdout_buffer
    sys.stderr = stderr_buffer
    
    try:
        # Import the actual app
        sys.path.insert(0, str(backend_dir))
        
        # First try direct import
        try:
            from main import app
            print("Successfully imported app from main.py")
        except ImportError:
            # Try with backend prefix
            from backend.main import app
            print("Successfully imported app from backend.main")
            
        # If we get here, import succeeded
        print("Main app imported successfully!")
        
    except Exception as e:
        # If there's an error, log it and use fallback
        error_details = traceback.format_exc()
        print(f"Error importing main app: {str(e)}\n{error_details}")
        app = fallback_app
        print("Using fallback app due to import error")
    
    finally:
        # Restore stdout and stderr
        sys.stdout = original_stdout
        sys.stderr = original_stderr
        
        # Print the captured output
        print("--- Import attempt output ---")
        print(stdout_buffer.getvalue())
        print("--- Import attempt errors ---")
        print(stderr_buffer.getvalue())
        print("---------------------------")
        
except Exception as outer_e:
    print(f"Outer exception: {str(outer_e)}")
    app = fallback_app

print(f"Final app used: {'Main app' if app != fallback_app else 'Fallback app'}")
print(f"Current directory: {os.getcwd()}")
print(f"Python path: {sys.path}")
print(f"Python version: {sys.version}")
print(f"Available files in backend: {os.listdir(backend_dir) if backend_dir.exists() else 'backend dir not found'}")

# This is necessary for Render to import the app