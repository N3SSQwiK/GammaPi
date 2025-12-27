# Tasks: Stability and Quality Refactor

## 1. Stability Improvements
- [ ] 1.1 Add truncation (`.substring(0, 4000)`) to the audit report embed in `auditHandler.ts`.
- [ ] 1.2 Wrap `handleAccessButton` and `handleAccessModal` in try/catch blocks with proper error logging and user feedback.

## 2. Operations Refactor
- [ ] 2.1 Refactor `/vote` to use `ButtonBuilder` (Yes/No/Abstain) and a button collector.
- [ ] 2.2 Extract `/attendance` collector logic into `src/modules/operations/attendanceHandler.ts`.
- [ ] 2.3 Extract `/vote` logic into `src/modules/operations/voteHandler.ts`.

## 3. Architectural Refactor (Repository Pattern)
- [ ] 3.1 Create `src/lib/repositories/userRepository.ts` for user-related queries.
- [ ] 3.2 Create `src/lib/repositories/ticketRepository.ts` for verification tickets.
- [ ] 3.3 Create `src/lib/repositories/attendanceRepository.ts` for meeting data.
- [ ] 3.4 Refactor all modules/commands to use these repositories instead of direct `db.prepare()`.
