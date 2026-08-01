# Pocket

A full-stack personal finance tracker. Log recurring and one-off income, log expenses, view daily/monthly stats, set savings goals (e.g. "buy a car"), and get algorithm-driven predictions for when you'll reach them.

## Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, `lucide-react` icons, `framer-motion` animation, `recharts` charts.
- **Backend**: Node.js + Express, MongoDB Atlas via Mongoose, JWT auth (`bcryptjs` for password hashing).
- **Infra**: Docker Compose for local/prod-like runs. MongoDB stays on Atlas — it is never containerized.

## Project structure
```
backend/
  src/
    config/db.js           Mongoose connection to Atlas
    models/                User, IncomeEntry, ExpenseEntry, Goal
    controllers/            Route handlers (auth, income, expense, stats, goals)
    routes/                 Express routers, mounted in app.js
    services/
      statsService.js       Daily/monthly/category/trend aggregation queries
      projections.js         The 4 goal-projection algorithms (pure functions)
      suggestions.js          Turns projection output into plain-language sentences
    middleware/auth.js      JWT verification, sets req.userId
    app.js / server.js      Express app wiring / entrypoint
frontend/
  src/
    app/
      login/, register/     Public auth pages
      (app)/                 Route group: sidebar layout + auth guard
        dashboard/            Stats + charts + goal progress + suggestions
        transactions/          Income/expense CRUD + "log a raise" flow
        goals/                 Goal creation + all 4 projection algorithms
    components/              Shared UI (StatCard, TrendChart, CategoryDonut, forms, etc.)
    lib/
      api.ts                 Fetch wrapper, attaches JWT from localStorage
      auth-context.tsx        React context for the logged-in user
      types.ts                 TypeScript types mirroring backend response shapes
      format.ts                Currency/category formatting helpers
docker/
  Dockerfile.backend        Node 20-alpine, npm ci --omit=dev, node src/server.js
  Dockerfile.frontend       Multi-stage: next build -> next start
docker-compose.yml          backend + frontend services (Mongo stays on Atlas)
```

## Prerequisites
- Node.js 20+ and npm
- A MongoDB Atlas cluster (free tier is fine) and its connection string
- Docker + Docker Compose (only needed for the containerized run)

## Setup

### 1. Environment variables
Copy the example env files and fill in real values — never commit real credentials:
```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

`backend/.env`:
| Var | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/pocket`) |
| `JWT_SECRET` | Long random string used to sign JWTs (`openssl rand -hex 32` works well) |
| `PORT` | Port the API listens on (default `5000`) |

`frontend/.env.local`:
| Var | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000`). Baked into the client bundle at build time since it's `NEXT_PUBLIC_*`. |

### 2. Run locally
```
cd backend && npm install && npm run dev    # nodemon, http://localhost:5000
cd frontend && npm install && npm run dev   # http://localhost:3000
```
Run both in separate terminals. The frontend calls the backend via `NEXT_PUBLIC_API_URL`.

### 3. Run with Docker
Make sure `backend/.env` and `frontend/.env.local` are filled in with real values, then from the repo root:
```
docker-compose up --build
```
This builds and runs both containers (frontend on `:3000`, backend on `:5000`). MongoDB is not containerized — both the local and Docker runs connect to the same Atlas cluster via `MONGODB_URI`. `NEXT_PUBLIC_API_URL` is passed as a build arg to the frontend image (defaults to `http://localhost:5000` if not set in the shell environment), since Next.js inlines `NEXT_PUBLIC_*` vars at build time, not runtime.

## Data model

**User** — `email`, `password` (bcrypt hash), `name`.

**IncomeEntry** — `amount`, `source`, `type` (`recurring` | `one-time`), `startDate`, `endDate` (nullable), `isActive`, `note`. Raises are never destructive: editing a recurring entry's amount closes the old entry (`endDate` + `isActive: false`) and creates a new one starting from the effective date, so historical totals stay accurate.

**ExpenseEntry** — `amount`, `category` (`housing | food | dining | transport | entertainment | shopping | health | utilities | other`), `date`, `note`.

**Goal** — `name`, `targetAmount`, `targetDate` (optional).

All documents are scoped to `userId` and queried with that filter on every request.

## API reference
All routes are prefixed with `/api` and (except auth) require `Authorization: Bearer <token>`.

**Auth**
- `POST /api/auth/register` — `{ email, password, name }` → `{ token, user }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`

**Income**
- `GET /api/income` — list, newest `startDate` first
- `POST /api/income` — `{ amount, source, type, startDate, endDate?, note? }`
- `PUT /api/income/:id/replace` — `{ amount, effectiveDate, source?, note? }` — the raise flow: closes the entry as of `effectiveDate` and opens a new one
- `PATCH /api/income/:id/deactivate` — `{ endDate? }`
- `DELETE /api/income/:id`

**Expenses**
- `GET /api/expenses?from=&to=` — list, optionally filtered by date range
- `POST /api/expenses` — `{ amount, category, date, note? }`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

**Stats**
- `GET /api/stats/daily?date=` — that day's income/expense totals + entries
- `GET /api/stats/monthly?year=&month=` — `{ totalIncome, totalExpenses, netSavings }`
- `GET /api/stats/categories?year=&month=` — spend grouped by category
- `GET /api/stats/trend?months=6` — trailing N months of monthly summaries, oldest first

**Goals**
- `GET /api/goals` — list
- `POST /api/goals` — `{ name, targetAmount, targetDate? }`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`
- `GET /api/goals/:id/projections` — runs all four algorithms below and returns them together with plain-language suggestions

## The four projection algorithms
Computed in `backend/src/services/projections.js` from the trailing 6 months of `{totalIncome, totalExpenses, netSavings}` (via `statsService.trend`):

1. **Average savings rate** — mean monthly net savings over the trailing window → `remaining / avgRate` months to goal.
2. **Weighted recent-trend** — same idea, but the last 3 months are weighted more heavily (3x / 2x / 1.5x / 1x by recency) so a recent raise or spending change moves the estimate faster than a flat average would.
3. **Best/worst-case range** — uses the standard deviation of monthly net savings to produce an optimistic ETA (`avg + stddev`) and a pessimistic one (`avg - stddev`, floored to avoid negative/zero rates).
4. **Category-cut suggestions** — looks at the trailing 3 months of spend in discretionary categories (`dining`, `entertainment`, `shopping`), picks the top 1–3 by average monthly spend, and estimates the new ETA if each were cut by 15%.

`suggestions.js` turns these four outputs into 1–2 plain-language sentences (e.g. *"At your current rate you'll hit this goal in 8 months. Cutting dining out by 15% gets you there in 6."*), shown in the Suggestions panel on both the dashboard and goals page.

## Frontend routes
- `/login`, `/register` — public
- `/dashboard` — today's summary, income-vs-expense trend chart, category breakdown donut, active goal progress, suggestions
- `/transactions` — add/list/delete income and expenses; "Log a raise" on active recurring income
- `/goals` — create goals; select one to see all four projections + suggestions

All three app routes live under `(app)/layout.tsx`, which renders the sidebar and redirects to `/login` if there's no authenticated user (checked via `AuthProvider` in `lib/auth-context.tsx`, backed by a JWT + user object in `localStorage`).

## Troubleshooting
- **Dashboard/goals pages redirect to `/login` in a loop**: the JWT in `localStorage` is missing or the backend rejected it — check `NEXT_PUBLIC_API_URL` points at a running backend and that `backend/.env`'s `JWT_SECRET` hasn't changed since the token was issued.
- **`docker-compose up` backend container exits immediately**: almost always a bad or missing `MONGODB_URI` in `backend/.env` — check container logs with `docker-compose logs backend`.
- **Frontend shows stale `NEXT_PUBLIC_API_URL` after changing `.env.local`**: that var is inlined at build time. Restart `next dev` for local runs, or `docker-compose up --build` (not just `up`) for Docker.
- **New expense category not showing correct color/label on the dashboard**: category enums are defined in two places that must stay in sync — `backend/src/models/ExpenseEntry.js` (`EXPENSE_CATEGORIES`) and `frontend/src/lib/types.ts` (`ExpenseCategory`), with display colors in `frontend/src/lib/format.ts`.

## Development notes
- Backend and frontend are independent npm projects — there's no shared `node_modules` or monorepo tooling (no Turborepo/Nx). Install and run each separately.
- No ORM/framework substitutions beyond what's listed in Stack (no Prisma, no NestJS) — Mongoose models are the source of truth for schema.
- Git history is incremental by design (one commit per completed feature/step) — see `git log` for the build order: backend scaffold → stats → goals/projections → dashboard → transactions → goals UI → Docker.
