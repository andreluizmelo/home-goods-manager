# Working conventions for this repo

## Save plans as documents

Before starting non-trivial implementation work (multi-step features, migrations, anything discussed in plan mode), save the plan as a markdown file in [`plans/`](plans/), named `YYYY-MM-DD-short-title.md`. See `plans/README.md` for the convention. Keep the file after the work is done — it's a record, not a scratch pad.

## Record architecture decisions

When a decision is non-obvious or was chosen over a real alternative (data model shape, a "why not X instead" call, a deferred feature), add an ADR under [`docs/adr/`](docs/adr/) using `docs/adr/template.md`. See `docs/adr/README.md` for the index and format.
