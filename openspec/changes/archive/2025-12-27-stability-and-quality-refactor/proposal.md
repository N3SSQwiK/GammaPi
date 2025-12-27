# Change: Stability and Quality Refactor

## Why
A code review identified several stability and quality issues:
- Unbounded embed descriptions can crash the bot when reporting many issues.
- Missing error boundaries in interaction handlers can lead to silent failures.
- Reaction-based voting is fragile and lacks integrity.
- Direct database access in commands leads to scattered logic and poor testability.

## What Changes
- **Stability:** Add truncation to all embed descriptions (max 4000 characters).
- **Stability:** Implement try/catch error boundaries in `accessHandler.ts` and other key modules.
- **Quality:** Refactor `/vote` to use Buttons and a Component Collector instead of Reactions.
- **Architecture:** Introduce a Repository layer (`src/lib/repositories/`) to abstract SQLite operations.
- **Architecture:** Extract inline logic from `/attendance` and `/vote` into dedicated module handlers.

## Impact
- **Affected Specs:**
    - `audit`: Truncation requirement.
    - `operations`: Secure voting and modular logic.
    - `bot-core`: Global error handling patterns.
- **Affected Code:**
    - `src/modules/audit/auditHandler.ts`
    - `src/commands/vote.ts`
    - `src/commands/attendance.ts`
    - `src/modules/access/accessHandler.ts`
    - New files in `src/lib/repositories/`
