## Why

The gap analysis identified two spec areas that are out of sync with implementation: the operations spec is minimal (8 lines, missing attendance entirely) and the community module has no spec despite being fully implemented. This creates risk of accidental regression and makes onboarding new developers harder.

## What Changes

- Document the existing `attendance` table schema and `/attendance` command flow
- Document the existing `votes` table schema and voting behavior
- Create new `community` spec documenting `#lions-den` and `#tech-support` forum channels
- No code changes—this is purely documentation of existing behavior

## Capabilities

### New Capabilities

- `community`: Forum channels for brotherhood engagement (lions-den personal blogs, tech-support bug reports)

### Modified Capabilities

- `operations`: Adding attendance and voting schema documentation (no behavior change, just documenting what exists)

## Impact

- No code changes required
- No API changes
- OpenSpec documentation only
- Improves spec coverage from ~85% to ~95% of implemented features
