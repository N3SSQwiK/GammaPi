# Change: Add Rules Agreement Module

## Why
Currently, verified users (Brothers, Guests) immediately gain access to the server content upon verification. To ensure professional conduct and liability protection, we need a mandatory "Rules Acceptance" step. Users must explicitly acknowledge the Code of Conduct before seeing the wider community.

## What Changes
- **Architecture:** Introduce a "Two-Step Access" model.
    - Step 1: Verification (Identity Proof) -> Grants Identity Role (e.g., `Brother`).
    - Step 2: Rules Agreement (Conduct) -> Grants Access Role (e.g., `✅ Agreed`).
- **Configuration:** Add `#rules-and-conduct` to the Golden State config.
- **Commands:** Create `/rules post` to deploy the interactive rules embed.
- **Database:** Track "Agreement Date" in the `users` table for audit purposes.

## Impact
- **Affected Specs:**
    - `access-control`: Access flow changes.
    - `bot-core`: New module.
- **Affected Code:**
    - `src/modules/access/rulesHandler.ts` (New)
    - `src/lib/repositories/userRepository.ts` (Schema update)
    - `src/modules/audit/serverConfig.ts` (New role/channel)
