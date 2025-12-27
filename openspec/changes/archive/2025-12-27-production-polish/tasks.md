# Tasks: Production Polish

## 1. Infrastructure Hardening
- [ ] 1.1 Add `fs.mkdirSync` to `src/lib/logger.ts` for log directory creation.
- [ ] 1.2 Remove `console.warn` from `src/config.ts`.
- [ ] 1.3 Add config validation logic to `src/index.ts` using `logger.error`.

## 2. Database & Repository
- [ ] 2.1 Add `votes` table to `src/lib/db.ts`.
- [ ] 2.2 Create `src/lib/repositories/voteRepository.ts`.
- [ ] 2.3 Refactor `userRepository.ts` to use an explicit column whitelist for upserts.

## 3. Persistent Voting
- [ ] 3.1 Refactor `voteHandler.ts` to save/update votes in the database.
- [ ] 3.2 Ensure vote counts are derived from the database on each button click.
