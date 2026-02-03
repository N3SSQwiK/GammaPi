# Change: Add Server Bootstrap Flow

## Why

A fresh FiotaBot installation has no brothers in the database. Since verification requires two brothers to approve a request, the first brothers cannot be verified through the normal flow. This creates a chicken-and-egg "bootstrap problem" that blocks server setup.

## What Changes

- Add `/bootstrap` command for server owner to self-register as first brother
- Command auto-disables once 2+ brothers exist in database
- Requires server owner permission (not just administrator)
- Collects essential identity info via modal
- Creates user record with BROTHER status and assigns role
- Logs bootstrap action for audit trail

## Impact

- Affected specs: `access-control`
- Affected code:
  - `src/commands/bootstrap.ts` (new file)
  - `src/lib/repositories/userRepository.ts` (add brother count query)
  - `src/index.ts` (register new command)
