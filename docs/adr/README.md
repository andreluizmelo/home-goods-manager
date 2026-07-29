# Architecture Decision Records

This folder records significant architecture and data-model decisions for Home Goods Manager, along with the context and trade-offs behind them.

## When to add one

Add a new ADR when a decision is non-obvious, was chosen over a real alternative, or would confuse a future contributor ("why is it built this way?") without the reasoning written down. Small implementation details don't need one — only decisions that shape the architecture or data model.

## Format

Each ADR uses the lightweight Nygard format: Context, Decision, Consequences. Copy `template.md` to `NNNN-short-title.md` (next sequential number, zero-padded to 4 digits) and fill it in.

## Index

| # | Title | Status |
|---|-------|--------|
| [0001](0001-unified-consumption-log.md) | Unify consumption tracking into a single ConsumptionLog model | Accepted |
| [0002](0002-on-the-fly-expiration-urgency.md) | Compute expiration/opened urgency on render instead of persisted alerts | Accepted |
| [0003](0003-nextauth-for-authentication.md) | Use NextAuth.js v5 for authentication | Accepted |
