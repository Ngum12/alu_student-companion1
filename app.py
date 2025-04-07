"""
Root-level entry point for Render deployment that imports your backend app.
"""
import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
current_dir = Path(__file__).parent.absolute()
backend_dir = current_dir / "backend"
sys.path.insert(0, str(backend_dir))

print(f"Starting application...")
print(f"Current working directory: {os.getcwd()}")
print(f"Python path: {sys.path}")
print(f"Backend directory exists: {backend_dir.exists()}")
print(f"Files in backend: {os.listdir(backend_dir) if backend_dir.exists() else 'Directory not found'}")

# Import the app from backend/main.py
from main import app

# This file doesn't need any additional code - Render will import the 'app' variable