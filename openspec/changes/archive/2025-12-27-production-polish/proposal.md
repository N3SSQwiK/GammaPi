# Change: Production Polish

## Why
A follow-up code review identified minor non-critical improvements to reach maximum production readiness:
- Vote state is currently in-memory and lost on restart.
- Log directory must be created manually.
- Database upsert pattern is overly dynamic.
- Config warnings use `console.warn` instead of the structured logger.

## What Changes
- **Database:** Add `votes` table to SQLite schema.
- **Resilience:** Auto-create `logs/` directory in the Logger module.
- **Integrity:** Refactor `/vote` to persist data to the database using a new `voteRepository`.
- **Security:** Harden `userRepository` with a column whitelist for upserts.
- **Observability:** Move config validation to `index.ts` using the new Logger.

## Impact
- **Affected Specs:**
    - `operations`: Persistent voting requirement.
    - `bot-core`: Logging and data integrity.
- **Affected Code:**
    - `src/lib/db.ts`
    - `src/lib/logger.ts`
    - `src/lib/repositories/voteRepository.ts` (New)
    - `src/lib/repositories/userRepository.ts`
    - `src/modules/operations/voteHandler.ts`
    - `src/config.ts`
    - `src/index.ts`
