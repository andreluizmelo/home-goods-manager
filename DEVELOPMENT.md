# Development Workflow Notes

For initial setup (install, Docker, database, running the app, tests), see [README.md](README.md). This doc covers day-to-day workflows once you're up and running.

## Creating a database migration

After modifying `prisma/schema.prisma`:

```bash
yarn prisma:migrate
```

This will:
1. Detect schema changes
2. Prompt for a migration name
3. Generate a SQL migration file in `prisma/migrations/`
4. Apply the migration to the dev database
5. Regenerate the Prisma client

## Common tasks

### Adding a new product feature

1. Update `prisma/schema.prisma` with new fields
2. Run `yarn prisma:migrate` to create a migration
3. Add an API route in `app/api/products/`
4. Add a component in `components/`
5. Write tests in `__tests__/`
6. Update the UI page in `app/products/`

### Adding a new page

1. Create a directory in `app/` (e.g., `app/new-feature/`)
2. Add `page.tsx` for the page component
3. Add a route layout if needed (`layout.tsx`)
4. Create components in `components/`
5. Add tests in `__tests__/`

### Debugging

- Enable detailed logging by setting `NODE_ENV=development`
- Use `yarn prisma:studio` to inspect the database
- Check browser DevTools for frontend issues
- Server logs appear in the terminal where `yarn dev` is running

## Stopping Docker services

```bash
docker-compose down
```

Remove volumes too (wipes the database):

```bash
docker-compose down -v
```

## Environment variables reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://homegoods:homegoods123@localhost:5432/home_goods_db` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Session encryption | `dev-secret-key-change-in-prod` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `LOCALSTACK_ENDPOINT` | LocalStack AWS simulation | `http://localhost:4566` |

Set in both `.env` (Prisma CLI) and `.env.local` (Next.js runtime) — see the README for why there are two files.
