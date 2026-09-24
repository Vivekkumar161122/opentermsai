#!/usr/bin/env bash
# OpenTerms AI Local Launch Script

set -e
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=================================================="
echo " Starting OpenTerms AI Services Locally"
echo "=================================================="

# Kill any existing processes on ports 8000 and 3000
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "1. Starting FastAPI Backend on http://localhost:8000 ..."
cd "$PROJECT_ROOT"
source backend/venv/bin/activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "2. Starting Next.js Frontend on http://localhost:3000 ..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================================="
echo " OpenTerms AI is running locally!"
echo " - Dashboard:  http://localhost:3000"
echo " - API Docs:   http://localhost:8000/docs"
echo "=================================================="
echo "Press Ctrl+C to terminate both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
