# Graph Report - .  (2026-08-04)

## Corpus Check
- 47 files · ~15,519 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 507 nodes · 862 edges · 27 communities (20 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.53)
- Token cost: 50,000 input · 5,103 output

## Community Hubs (Navigation)
- Dashboard/Goals/Transactions Pages
- Frontend Form Components
- Frontend Third-Party Dependencies
- Goal Controller & Projections
- Goal Algorithms & README Docs
- Express App Setup
- Frontend TS Config
- Frontend Dev Dependencies
- Backend Package Config
- App Shell & Auth Pages
- Auth Controller & User Model
- shadcn/ui Components Config
- Theme, Locale & Currency Providers
- Income Controller & Auth Middleware
- Stats Controller
- Stats Service & Income Model
- Dropdown Menu UI Primitive
- README API & Model Docs
- Next.js Config
- Next.js Env Types
- Tailwind Config
- README Auth Routes Doc
- README Expenses Routes Doc
- README Stats Routes Doc
- README User Model Doc

## God Nodes (most connected - your core abstractions)
1. `useI18n()` - 35 edges
2. `cn()` - 21 edges
3. `useCurrency()` - 18 edges
4. `compilerOptions` - 16 edges
5. `useAuth()` - 10 edges
6. `Button` - 10 edges
7. `Card` - 10 edges
8. `CardContent` - 10 edges
9. `projections.js` - 8 edges
10. `computeProjections()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `/dashboard route` --references--> `recharts`  [INFERRED]
  README.md → frontend/package.json
- `JWT auth` --references--> `bcryptjs`  [EXTRACTED]
  README.md → backend/package.json
- `DatePicker.tsx` --references--> `date-fns`  [EXTRACTED]
  README.md → frontend/package.json
- `DatePicker.tsx` --references--> `date-fns-jalali`  [EXTRACTED]
  README.md → frontend/package.json
- `ThemeToggle.tsx` --references--> `next-themes`  [EXTRACTED]
  README.md → frontend/package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Localization system (language switch, RTL sync, dictionaries, hook)** — readme_localization, readme_i18n_dictionaries, readme_localehtmlsync_tsx, readme_languageswitcher_tsx, readme_usei18n_hook [EXTRACTED 1.00]
- **Goal projection pipeline (stats -> algorithms -> suggestions -> API -> UI)** — readme_statsservice_js, readme_projections_js, readme_suggestions_js, readme_api_goals_routes, readme_goals_route [EXTRACTED 1.00]
- **Expense category cross-file sync requirement** — readme_expenseentry_model, readme_format_ts, readme_i18n_dictionaries, readme_category_color_sync [EXTRACTED 1.00]
- **Docker Compose infra: backend + frontend containers, Atlas MongoDB stays external** — docker_compose [EXTRACTED 1.00]

## Communities (27 total, 7 thin omitted)

### Community 0 - "Dashboard/Goals/Transactions Pages"
Cohesion: 0.06
Nodes (60): containerVariants, DailySummary, DashboardPage(), cardVariants, containerVariants, GoalsPage(), cardVariants, containerVariants (+52 more)

### Community 1 - "Frontend Form Components"
Cohesion: 0.08
Nodes (39): Props, DatePicker(), GREGORIAN_LOCALES, Props, CATEGORIES, Props, Props, Props (+31 more)

### Community 2 - "Frontend Third-Party Dependencies"
Cohesion: 0.05
Nodes (44): class-variance-authority, clsx, date-fns, date-fns-jalali, framer-motion, dependencies, class-variance-authority, clsx (+36 more)

### Community 3 - "Goal Controller & Projections"
Cohesion: 0.10
Nodes (30): { buildSuggestions }, { computeProjections }, create(), Goal, list(), mongoose, projections(), remove() (+22 more)

### Community 4 - "Goal Algorithms & README Docs"
Cohesion: 0.06
Nodes (34): bcryptjs, recharts, Goals API routes, auth-context.tsx, Average savings rate algorithm, Backend suggestion sentences not translated (known limitation), Best/worst-case range algorithm, Category-cut suggestions algorithm (+26 more)

### Community 5 - "Express App Setup"
Cohesion: 0.07
Nodes (25): app, authRoutes, cors, expenseRoutes, express, goalRoutes, incomeRoutes, statsRoutes (+17 more)

### Community 6 - "Frontend TS Config"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 7 - "Frontend Dev Dependencies"
Cohesion: 0.08
Nodes (23): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+15 more)

### Community 8 - "Backend Package Config"
Cohesion: 0.08
Nodes (23): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose, devDependencies (+15 more)

### Community 9 - "App Shell & Auth Pages"
Cohesion: 0.17
Nodes (14): AppLayout(), LoginPage(), Home(), RegisterPage(), AuthForm(), CurrencySwitcher(), LanguageSwitcher(), Sidebar() (+6 more)

### Community 10 - "Auth Controller & User Model"
Cohesion: 0.14
Nodes (13): bcrypt, jwt, login(), register(), signToken(), User, mongoose, userSchema (+5 more)

### Community 11 - "shadcn/ui Components Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 12 - "Theme, Locale & Currency Providers"
Cohesion: 0.18
Nodes (11): metadata, LocaleHtmlSync(), ThemeProvider(), CurrencyContext, CurrencyContextValue, CurrencyProvider(), CurrencyCode, CurrencyMeta (+3 more)

### Community 13 - "Income Controller & Auth Middleware"
Cohesion: 0.17
Nodes (12): create(), deactivate(), IncomeEntry, list(), remove(), replace(), jwt, asyncHandler (+4 more)

### Community 14 - "Stats Controller"
Cohesion: 0.23
Nodes (13): categories(), daily(), mongoose, monthly(), parseYearMonth(), statsService, toUserId(), trend() (+5 more)

### Community 15 - "Stats Service & Income Model"
Cohesion: 0.22
Nodes (12): incomeEntrySchema, mongoose, categoryBreakdown(), dailySummary(), dayRange(), ExpenseEntry, IncomeEntry, monthlyExpenseTotal() (+4 more)

### Community 16 - "Dropdown Menu UI Primitive"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 17 - "README API & Model Docs"
Cohesion: 0.20
Nodes (10): Income API routes, Expense category three-place sync requirement, ExpenseEntry model, format.ts, Incremental git history convention, i18n dictionaries (en.json/fa.json/fr.json), IncomeEntry model, Non-destructive raise/edit flow for recurring income (+2 more)

## Knowledge Gaps
- **217 isolated node(s):** `name`, `version`, `private`, `type`, `main` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Frontend Third-Party Dependencies` to `Goal Algorithms & README Docs`, `Frontend Dev Dependencies`?**
  _High betweenness centrality (0.345) - this node is a cross-community bridge._
- **Why does `AuthProvider()` connect `Auth Controller & User Model` to `App Shell & Auth Pages`, `Theme, Locale & Currency Providers`?**
  _High betweenness centrality (0.313) - this node is a cross-community bridge._
- **Why does `react` connect `Frontend Third-Party Dependencies` to `Frontend Form Components`?**
  _High betweenness centrality (0.307) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard/Goals/Transactions Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.063568010936432 - nodes in this community are weakly interconnected._
- **Should `Frontend Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08182349503214495 - nodes in this community are weakly interconnected._
- **Should `Frontend Third-Party Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._