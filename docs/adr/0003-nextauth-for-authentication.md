# 0003. Use NextAuth.js v5 for authentication

Date: 2026-07-28

## Status

Accepted

## Context

The app needs multi-tenant authentication with per-user data isolation and JWT-based session management. Two options were on the table: NextAuth.js v5 (self-hosted, integrates directly into the Next.js app) and Supabase Auth (a managed auth service).

The rest of the stack is already self-hosted for local dev — Postgres and Prisma running via Docker Compose, with the `User` model (including `passwordHash`) defined directly in `prisma/schema.prisma`. Supabase Auth would mean either adopting Supabase as the Postgres provider or running a second auth system alongside the existing Prisma-modeled `User` table.

## Decision

We will use NextAuth.js v5 (currently the `5.0.0-beta.32` package), with sessions backed by the app's own Prisma `User` model rather than a managed auth provider.

## Consequences

- Authentication stays inside the Next.js app and the existing Prisma/Postgres setup — no second database or external auth service to provision, configure, or keep in sync with `userId` foreign keys used throughout the schema.
- Full control over the `User` model and password handling (bcrypt hashing, as noted in the security considerations), consistent with the self-hosted Docker Compose local-dev story.
- We take on auth plumbing ourselves (session callbacks, password reset flow, etc.) that a managed provider like Supabase Auth would otherwise handle.
- No built-in social login / magic-link providers unless additional NextAuth providers are configured later.
- Since `next-auth` v5 is still in beta, breaking changes between beta releases are possible and should be checked before upgrading the dependency.
