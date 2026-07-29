# Home Goods Manager

A web app for tracking household inventory — food, cleaning supplies, and everything else you keep stocked at home. It tracks quantities, expiration dates, and how long an item is good for once opened, and ties that into recipes and shopping.

> Built as a project to explore Claude Code (including Claude Design) end to end — from planning through implementation.

## What it does

- **Inventory tracking**: quantities and expiration dates per product, separate from the product definition itself (the same "Flour" product can have several unopened bags and one opened bag in storage at once).
- **Opened-item tracking**: some products have a shorter "use by" window once opened (e.g. 5 days), independent of the printed expiration date. Opened items track a qualitative remaining amount (Full, Half, Almost Empty, Empty) rather than forcing an exact measurement.
- **Product catalog with substitution groups**: products are distinguished by brand (Flour — Brand A vs. Flour — Brand B are different products), but can be grouped so the system knows they're interchangeable.
- **Recipes**: define what a recipe uses and roughly how much (a little, one, a few, multiple...). Making a recipe walks you through which specific inventory items were used and marks them opened or consumed.
- **Flexible consumption logging**: a single consumption event can be "used 2 whole cans" or "used about a third of the opened bag" — whole-unit and partial/qualitative consumption are both first-class, with an optional exact measurement (grams, ml) for anyone who wants precision.
- **Shopping**: build a shopping list or an in-store cart, see a running price total, and get a price-history-based comparison against what you paid last time.
- **Price history** per product, recorded as you log purchases.
- **Per-user accounts**: everyone sees only their own inventory.
- **Expiration awareness**: urgency (expired / danger / warning / safe) is computed from `NotificationPreference` thresholds when pages render. There's no background worker yet — that's a planned future phase.

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the full data model, phased feature roadmap, and UI/design notes.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 15 (App Router) + React 19, TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL, via [Prisma](https://www.prisma.io/) ORM |
| Auth | NextAuth.js v5 |
| Testing | Jest + React Testing Library, 80% coverage enforced |
| Local cloud simulation | [LocalStack](https://www.localstack.io/) |
| Containers | Docker Compose (Postgres, pgAdmin, LocalStack) |
| Package manager | Yarn (Classic, v1) |
| Git hooks | Husky + lint-staged |

## Prerequisites

- Node.js 18.18+ (check with `node --version`)
- [Yarn](https://classic.yarnpkg.com/) (`npm install -g yarn` if you don't have it)
- Docker Desktop (with the engine running)
- Git

## Getting started

### 1. Install dependencies

```bash
yarn install
```

### 2. Set up environment variables

Copy the example env file to **both** `.env` and `.env.local` — both are git-ignored, and each is read by a different tool:

```bash
cp .env.example .env
cp .env.example .env.local
```

- `.env` — read by the **Prisma CLI** (`validate`, `format`, `generate`, `migrate`). Prisma does not understand Next.js's `.env.local` convention.
- `.env.local` — read by **Next.js** at runtime (and overrides `.env` for the dev server).

Keep both in sync if you change a value (e.g. `DATABASE_URL`).

### 3. Start Docker services

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL 16** on `localhost:5432` (the app database)
- **pgAdmin** on [localhost:5050](http://localhost:5050) (DB browser — login `admin@example.com` / `admin123`)
- **LocalStack** on `localhost:4566` (simulates AWS services locally; not required for the MVP, reserved for future notification/queue features)

Check they're up:

```bash
docker-compose ps
```

### 4. Set up the database

```bash
yarn prisma:generate
```

First-time migration (creates all tables; needs a name since there's no migration history yet):

```bash
yarn prisma migrate dev --name init
```

After that, `yarn prisma:migrate` will prompt you for a name on each subsequent schema change.

### 5. Run the dev server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running tests

```bash
yarn test          # full run with coverage report
yarn test:watch    # watch mode
```

Coverage must stay at **80%+** across branches, functions, lines, and statements (`jest.config.js`) — this is enforced automatically before every commit (see below), not just in CI. Two files are excluded from the coverage calculation because they contain no branching logic to test: `lib/db.ts` (Prisma client singleton) and `app/layout.tsx` (trivial root layout).

## Code quality checks

```bash
yarn lint          # ESLint
yarn type-check    # tsc --noEmit
```

## Pre-commit hooks

Husky (`.husky/pre-commit`) + lint-staged (`package.json`) run automatically on every `git commit`, in order:

1. **lint-staged**, scoped to staged files only:
   - `*.{ts,tsx}` → `eslint --fix`
   - `prisma/schema.prisma` → `prisma format` (auto-fixes formatting, re-staged automatically), then `prisma validate` (blocks the commit if the schema is invalid)
2. **`yarn type-check`** — whole-project TypeScript check
3. **`yarn test`** — full Jest run with the 80% coverage threshold enforced

Any failure blocks the commit. To bypass in an emergency (not recommended):

```bash
git commit --no-verify
```

## Database management

**Prisma Studio** (visual editor for your data):

```bash
yarn prisma:studio
```

Opens at [http://localhost:5555](http://localhost:5555).

**pgAdmin**: see step 3 above. Add a server connection with host `postgres`, username `homegoods`, password `homegoods123`, database `home_goods_db`.

**psql directly**:

```bash
docker exec -it home-goods-postgres psql -U homegoods -d home_goods_db
```

## Project structure

```
home-goods-manager/
├── app/                # Next.js App Router pages, layouts, API routes
├── components/         # Reusable React components
├── lib/                # Prisma client, shared utilities
├── hooks/              # Custom React hooks
├── __tests__/          # Jest test suites (mirrors source layout)
├── prisma/
│   ├── schema.prisma   # Data model
│   └── migrations/     # Migration history
├── docker-compose.yml  # Postgres, pgAdmin, LocalStack
├── PROJECT_PLAN.md     # Full data model, roadmap, and design notes
└── DEVELOPMENT.md      # Extended day-to-day dev workflow notes
```

## Troubleshooting

**Database connection error** — confirm the container is running (`docker-compose ps`) and that `DATABASE_URL` in `.env` / `.env.local` matches `docker-compose.yml`.

**Port already in use** (3000, 5432, 5050, or 4566) — stop the conflicting process, or change the port in `docker-compose.yml` and the env files.

**Prisma client out of sync after a schema change** — `yarn prisma:generate`.

**Coverage failing below 80%** — `yarn test` prints a per-file breakdown of what's uncovered.

More detail on day-to-day workflows (adding a feature, debugging, common tasks) lives in [DEVELOPMENT.md](DEVELOPMENT.md).
