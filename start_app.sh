#!/bin/bash
echo "Starting Epidemia-Labs Backend and Frontend..."

# Kill any lingering instances
pkill -f "uvicorn" || true
pkill -f "next dev" || true
sleep 2

# Start backend in the background
source .venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend in the foreground
cd frontend
npm run dev

# Cleanup if frontend stops
kill $BACKEND_PID
