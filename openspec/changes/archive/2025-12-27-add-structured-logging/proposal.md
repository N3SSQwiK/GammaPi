# Change: Add Structured Logging

## Why
Currently, the application relies on `console.log` and `console.error` for all output. This is insufficient for a production environment (VPS) because:
- Logs are unstructured text, making programmatic analysis impossible.
- There is no log rotation or persistence strategy (logs are lost if PM2 buffers flush or aren't captured).
- Debugging production issues requires grepping through massive text files.

## What Changes
- Install `winston` (and types) for structured logging.
- Implement a `Logger` module (`src/lib/logger.ts`) configured to write to:
    - Console (Pretty Print for dev).
    - `logs/error.log` (Level: Error).
    - `logs/combined.log` (Level: Info+).
- Refactor existing code to replace `console.*` with `logger.*`.

## Impact
- **Affected Specs:**
    - `bot-core`: New observability requirement.
- **Affected Code:**
    - `src/lib/logger.ts` (New)
    - All files using `console.log` (Refactor)
    - `.gitignore` (Exclude log files)
