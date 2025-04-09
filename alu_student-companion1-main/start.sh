#!/bin/bash
echo "Starting ALU Companion API..."
echo "Current directory: $(pwd)"
echo "Files in current directory: $(ls)"
echo "Files in backend directory: $(ls backend)"

# Change to backend directory and start the app
cd backend && python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

echo "Starting frontend service..."
npm run preview -- --host 0.0.0.0 --port $PORT