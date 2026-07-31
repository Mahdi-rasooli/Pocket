# Pocket

A personal finance tracker: log income and expenses, view daily/monthly stats, set savings goals, and get algorithm-driven predictions for when you'll reach them.

## Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, lucide-react, framer-motion, recharts.
- **Backend**: Node.js + Express, MongoDB Atlas via Mongoose, JWT auth.

## Project structure
```
frontend/   Next.js app
backend/    Express REST API
docker/     Dockerfiles for frontend and backend
docker-compose.yml
```

## Setup

### 1. Environment variables
Copy the example env files and fill in real values:
```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

`backend/.env`:
- `MONGODB_URI` — your MongoDB Atlas connection string.
- `JWT_SECRET` — a long random string used to sign JWTs.
- `PORT` — port for the API server (default 5000).

`frontend/.env.local`:
- `NEXT_PUBLIC_API_URL` — base URL of the backend API (e.g. `http://localhost:5000`).

### 2. Run locally
```
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```
Frontend runs on http://localhost:3000, backend on http://localhost:5000.

### 3. Run with Docker
Make sure `backend/.env` is filled in with a real Atlas URI and JWT secret, then:
```
docker-compose up --build
```
This builds and runs both the frontend and backend containers. MongoDB stays on Atlas — it is not containerized.

## Features
- JWT-based register/login.
- Recurring and one-time income entries (raises are logged as new entries, preserving history).
- Expense entries with category, date, note.
- Daily/monthly stats, category breakdown, income vs. expense trend.
- Savings goals with four projection algorithms (average rate, weighted recent trend, best/worst-case range, category-cut suggestions) plus a plain-language suggestions panel.
