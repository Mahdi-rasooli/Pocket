# Graph Report - .  (2026-08-01)

## Corpus Check
- Corpus is ~9,547 words - fits in a single context window. You may not need a graph.

## Summary
- 330 nodes · 489 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.52)
- Token cost: 40,000 input · 5,487 output

## Community Hubs (Navigation)
- Dashboard & Goals Display UI
- Frontend TypeScript Config
- Backend npm Dependencies
- Auth Pages & API Client
- Goal Controller & Suggestions
- Frontend npm Dependencies
- Stats Service, Docker & README
- Transactions UI (Income/Expense Forms)
- Auth Backend & Root Layout
- Income Controller & Middleware
- Expense Controller & Model
- Frontend Dev Tooling
- Backend App Entry & DB Config
- Stats Controller & Routes
- Goal Projection Algorithms
- Next.js Config
- Next.js Env Types
- Tailwind Config

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `formatCurrency()` - 12 edges
3. `useAuth()` - 11 edges
4. `computeProjections()` - 7 edges
5. `formatCategory()` - 7 edges
6. `apiFetch()` - 6 edges
7. `projections()` - 5 edges
8. `toUserId()` - 5 edges
9. `average()` - 5 edges
10. `bestWorstCaseRange()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AuthProvider()` --indirect_call--> `register()`  [INFERRED]
  frontend/src/lib/auth-context.tsx → backend/src/controllers/authController.js
- `AuthProvider()` --indirect_call--> `login()`  [INFERRED]
  frontend/src/lib/auth-context.tsx → backend/src/controllers/authController.js
- `projections()` --calls--> `computeProjections()`  [EXTRACTED]
  backend/src/controllers/goalController.js → backend/src/services/projections.js
- `AppLayout()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/app/(app)/layout.tsx → frontend/src/lib/auth-context.tsx
- `TransactionsPage()` --calls--> `formatCategory()`  [EXTRACTED]
  frontend/src/app/(app)/transactions/page.tsx → frontend/src/lib/format.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Four goal-projection algorithms implemented in projections.js** — backend_src_services_projections, readme_projection_average_savings_rate, readme_projection_weighted_recent_trend, readme_projection_best_worst_case_range, readme_projection_category_cut_suggestions [EXTRACTED 1.00]
- **Docker Compose infra: backend + frontend containers, Atlas MongoDB stays external** — docker_compose, docker_dockerfile_backend, docker_dockerfile_frontend, mongodb_atlas [EXTRACTED 1.00]

## Communities (19 total, 3 thin omitted)

### Community 0 - "Dashboard & Goals Display UI"
Cohesion: 0.08
Nodes (31): containerVariants, DailySummary, cardVariants, containerVariants, cardVariants, CategoryDonut(), CountUp(), GoalForm() (+23 more)

### Community 1 - "Frontend TypeScript Config"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 2 - "Backend npm Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose, devDependencies (+16 more)

### Community 3 - "Auth Pages & API Client"
Cohesion: 0.15
Nodes (16): AppLayout(), LoginPage(), Home(), RegisterPage(), AuthForm(), Props, links, Sidebar() (+8 more)

### Community 4 - "Goal Controller & Suggestions"
Cohesion: 0.12
Nodes (20): { buildSuggestions }, { computeProjections }, create(), Goal, list(), mongoose, projections(), remove() (+12 more)

### Community 5 - "Frontend npm Dependencies"
Cohesion: 0.09
Nodes (21): framer-motion, dependencies, framer-motion, lucide-react, next, react, react-dom, recharts (+13 more)

### Community 6 - "Stats Service, Docker & README"
Cohesion: 0.14
Nodes (18): incomeEntrySchema, mongoose, categoryBreakdown(), dailySummary(), dayRange(), ExpenseEntry, IncomeEntry, monthlyExpenseTotal() (+10 more)

### Community 7 - "Transactions UI (Income/Expense Forms)"
Cohesion: 0.16
Nodes (16): cardVariants, containerVariants, formatDate(), TransactionsPage(), CATEGORIES, ExpenseForm(), Props, IncomeForm() (+8 more)

### Community 8 - "Auth Backend & Root Layout"
Cohesion: 0.13
Nodes (14): bcrypt, jwt, login(), register(), signToken(), User, mongoose, userSchema (+6 more)

### Community 9 - "Income Controller & Middleware"
Cohesion: 0.14
Nodes (12): create(), deactivate(), IncomeEntry, list(), remove(), replace(), jwt, asyncHandler (+4 more)

### Community 10 - "Expense Controller & Model"
Cohesion: 0.15
Nodes (14): create(), { EXPENSE_CATEGORIES }, ExpenseEntry, list(), remove(), update(), EXPENSE_CATEGORIES, expenseEntrySchema (+6 more)

### Community 11 - "Frontend Dev Tooling"
Cohesion: 0.13
Nodes (15): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+7 more)

### Community 12 - "Backend App Entry & DB Config"
Cohesion: 0.13
Nodes (11): app, authRoutes, cors, expenseRoutes, express, goalRoutes, incomeRoutes, statsRoutes (+3 more)

### Community 13 - "Stats Controller & Routes"
Cohesion: 0.23
Nodes (13): categories(), daily(), mongoose, monthly(), parseYearMonth(), statsService, toUserId(), trend() (+5 more)

### Community 14 - "Goal Projection Algorithms"
Cohesion: 0.27
Nodes (14): average(), averageRateProjection(), bestWorstCaseRange(), categoryCutSuggestions(), computeProjections(), DISCRETIONARY_CATEGORIES, monthsToDate(), stddev() (+6 more)

## Knowledge Gaps
- **140 isolated node(s):** `name`, `version`, `private`, `type`, `main` (+135 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthProvider()` connect `Auth Backend & Root Layout` to `Auth Pages & API Client`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Pocket README` connect `Stats Service, Docker & README` to `Goal Controller & Suggestions`, `Goal Projection Algorithms`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _140 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard & Goals Display UI` be split into smaller, more focused modules?**
  _Cohesion score 0.0824524312896406 - nodes in this community are weakly interconnected._
- **Should `Frontend TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Backend npm Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Goal Controller & Suggestions` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._