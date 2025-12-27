# Tasks: Add Structured Logging

## 1. Setup
- [ ] 1.1 Install `winston` and `@types/winston` (Wait, winston includes types).
- [ ] 1.2 Update `.gitignore` to ignore `logs/` directory.

## 2. Implementation
- [ ] 2.1 Create `src/lib/logger.ts` configuring the Winston transport.
- [ ] 2.2 Refactor `src/index.ts` to use Logger.
- [ ] 2.3 Refactor `src/events/` to use Logger.
- [ ] 2.4 Refactor `src/modules/` to use Logger.
- [ ] 2.5 Refactor `src/lib/scheduler.ts` to use Logger.
