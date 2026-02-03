## Context

This is a documentation-only change. The code is complete and working—we're retroactively documenting existing behavior in the OpenSpec system to maintain spec-code alignment.

**Current state:**
- `operations/spec.md`: 8 lines, only covers voting restart survival
- `community/spec.md`: Does not exist
- Code has full attendance system, voting system, and two community forums

## Goals / Non-Goals

**Goals:**
- Document existing `attendance` table schema and command behavior
- Document existing `votes` table schema and voting flow
- Create `community` spec for lions-den and tech-support forums
- Achieve ~95% spec coverage of implemented features

**Non-Goals:**
- No code changes
- No new features
- No behavioral modifications
- Not documenting hypothetical/future features

## Decisions

### Decision 1: Extend operations spec vs. create new specs

**Choice:** Extend existing `operations/spec.md` with attendance and voting details.

**Rationale:** Attendance and voting are both "chapter operations" functionality. The spec already exists and covers voting partially. Adding attendance to the same spec maintains logical grouping.

### Decision 2: Community spec structure

**Choice:** Create minimal `community/spec.md` documenting channel purposes and tag requirements.

**Rationale:** The community module is infrastructure (forum channels) not behavior. A short spec documenting channel names, types, tags, and guidelines is sufficient. No complex scenarios needed.

## Risks / Trade-offs

**[Low] Spec may drift again** → Mitigated by OpenSpec workflow enforcement. Future changes require proposal → spec → implementation.

**[Low] Over-documentation** → Keep specs minimal. Document structure and constraints, not obvious behavior.
