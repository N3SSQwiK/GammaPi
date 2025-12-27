# Change: Refactor Query Builder

## Why
A code review identified a fragile query building pattern in the `findBrothersByIndustry` method (Repository Layer). While currently safe due to parameterized values, the manual string concatenation of SQL clauses is a known anti-pattern that can lead to accidental SQL injection if modified carelessly in the future.

## What Changes
- Refactor `userRepository.ts` to use a safer, more robust query construction pattern.
- Ensure all inputs, including status filters, are parameterized.

## Impact
- **Affected Specs:**
    - `bot-core`: Code quality and security requirement.
- **Affected Code:**
    - `src/lib/repositories/userRepository.ts`
