# 0001. Unify consumption tracking into a single ConsumptionLog model

Date: 2026-07-28

## Status

Accepted

## Context

The app needs to record two kinds of consumption events: using up whole unopened units directly (e.g. "used 2 whole cans"), and using part of an already-opened item (e.g. "used about a third of the opened bag"). It also needs to track consumption that happens as a side effect of making a recipe.

An earlier iteration of the data model considered a separate `ProductUsageEntry` concept dedicated to recipe-driven consumption, alongside a general consumption log for everyday use. That would mean two tables covering what is conceptually the same event — something got consumed, on some date, in some amount — just triggered by different user flows.

## Decision

We will use a single `ConsumptionLog` table for all consumption events, with:

- `inventoryItemId` (optional FK) — set when consuming whole unit(s) directly, no opened state involved.
- `openedInstanceId` (optional FK) — set when consuming part of an already-opened item.
- `recipeMakingId` (optional FK) — set only when the consumption happened while making a recipe; omitted for everyday consumption.
- `quantity_type` (Whole | Qualitative), plus the corresponding whole count, qualitative amount, or optional exact measurement.

Exactly one of `inventoryItemId` / `openedInstanceId` must be set on any given row — this is an application-level invariant, not a DB constraint.

## Consequences

- A single history table answers "what did I use and when" across both manual and recipe-driven consumption, without joining two tables or reconciling two schemas.
- Recipe-driven consumption is just regular consumption tagged with `recipeMakingId` — no duplicated modeling logic between the two flows.
- The exactly-one-of-two-FKs rule isn't enforced by Prisma/Postgres directly and must be validated in application code (API route / service layer) on every write path that creates a `ConsumptionLog` row.
- If a future requirement needs consumption that isn't tied to either an inventory item or an opened instance, this model will need to be revisited.
