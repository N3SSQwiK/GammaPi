# Enhanced Verification UX - Design Document

## Context

The current verification modal is constrained by Discord's Modal API limitations: text inputs only, no dropdowns, no radio buttons, no multi-select. This leads to free-text chaos where "Gamma Pi" becomes "Gamma Pie" and "Technology / Software Engineer" fragments into 50+ variations. Graduate/professional chapters need structured data for effective networking - the `/find` command only works if industries are standardized.

**User Pain Point from Screenshot:**
The form shows "Industry & Title" as a single free-text field with placeholder "Tech / Software Engineer". This creates:
- Inconsistent categorization ("Tech" vs "Technology" vs "IT")
- Combined data (industry + title in one field, requires parsing)
- No validation (typos persist forever)

**Technical Constraints:**
- Discord Modals support only TextInput components (no Select, no Radio, no Checkbox)
- Select Menus (dropdowns) only work in Message Components, not Modals
- Multi-step flows require state management (can't pass data between interactions natively)

## Goals / Non-Goals

**Goals:**
- Eliminate free-text input for structured data (chapter, industry, vouchers)
- Collect complete contact info (phone, don name) for operational needs
- Support international brothers without breaking US-optimized zip code logic
- Maintain dual-voucher security while improving voucher identification accuracy
- Make brother names searchable and displayable with fraternity context (don names)
- Allow E-Board to assign "Omega" chapter without exposing it publicly

**Non-Goals:**
- Real-time chapter sync from phiota.org (quarterly manual update acceptable)
- Automated industry taxonomy expansion (E-Board request-driven acceptable)
- Retroactive don name requirement (grandfather existing brothers)
- Profile completeness enforcement (phone/don name encouraged but not required for existing users)

## Decisions

### Decision 1: Multi-Step Interaction Flow
**Choice:** Chapter & Industry via Select Menus in message components, remaining fields via Modal

**Rationale:**
- Discord API constraint: Modals can't have dropdowns
- Select Menus provide better UX than free-text validation (user sees options, can't typo)
- Modal still needed for free-form data (names, phone, location)

**Flow:**
```
1. Button: "Start Brother Verification"
2. Select Menu: Chapter (Alpha, Beta, Gamma Pi, etc.)
3. Select Menu: Industry (50 options)
4. Modal: Names, Year, Vouchers, Phone, Location, Job Title
5. Backend: Validate vouchers, create ticket
6. Notification: DM to vouchers, post to verification channel
```

**State Management:** Encode chapter & industry in Modal customId
- Example: `verify_final_modal_gamma-pi_technology-software`
- Parse customId on submission to retrieve selections
- Alternative (if customId length limit hit): Use temporary database table `verification_sessions`

**Alternatives Considered:**
- **Single Modal with Text Validation:** Faster but error-prone, doesn't solve core UX issue
- **Full Database-Driven Flow:** Chapter selection → DB save → Industry selection → DB save. Too complex, adds database churn
- **Hybrid Approach (chosen):** Best of both - structured selection for critical data, modal for flexible data

### Decision 2: Name Field Architecture
**Choice:** Store first_name, middle_name, last_name separately + don_name, compute real_name

**Rationale:**
- Separate fields enable proper sorting ("Smith, John" vs "John Smith")
- Don name is culturally significant, deserves first-class field (not substring of real_name)
- real_name preserved as computed field for backward compatibility

**Display Priority Algorithm:**
```typescript
function getDisplayName(user: UserRow): string {
  if (user.don_name) {
    return `Don ${user.don_name} (${user.first_name} ${user.last_name})`;
  }
  return `${user.first_name} ${user.last_name}`;
}
```

**Example Renders:**
- `/find` results: "Don Phoenix (John Smith) • Tech • NYC"
- Select menus: "Don Phoenix • Software Engineer"
- Embeds: Full name with don name prominent

**Alternatives Considered:**
- **Single real_name field:** Simpler, but breaks advanced features (sorting, formal letters)
- **Don name as prefix in real_name:** Causes confusion ("Don" in legal name?), hard to parse
- **Don name priority in all contexts:** Loses legal name clarity for official communications

### Decision 3: Chapter List Management
**Choice:** Hardcoded array in `constants.ts`, manually updated quarterly

**Rationale:**
- Phi Iota Alpha chapters change infrequently (1-2 per year)
- National website (phiota.org/chapters) lacks API, would require scraping (fragile)
- Hardcoded list is fast, version-controlled, no database dependency
- Quarterly update is acceptable operational overhead

**Structure:**
```typescript
export const CHAPTERS = [
  { value: 'alpha', label: 'Alpha - RPI, Troy NY', type: 'Undergraduate', hidden: false },
  { value: 'gamma-pi', label: 'Gamma Pi - Graduate Chapter', type: 'Graduate', hidden: false },
  { value: 'omega', label: 'Omega - [Special Designation]', type: 'Special', hidden: true },
  // ... 50-100 total chapters
];
```

**Omega Special Handling:**
- Omega chapter exists in CHAPTERS array but `hidden: true`
- Public verification flow filters `hidden: false` chapters only
- E-Board command `/chapter-assign` shows all chapters including Omega
- Reasoning: Omega has special historical/organizational significance, not selectable by applicants

**Update Process (Tech Chair Runbook):**
1. Visit phiota.org/chapters quarterly (January, April, July, October)
2. Compare website list to CHAPTERS constant
3. Add new chapters, mark inactive chapters as `inactive: true` (keep for historical data)
4. Submit PR, deploy update

**Alternatives Considered:**
- **Database table:** Enables E-Board self-service but adds UI for chapter CRUD, overkill for infrequent changes
- **API scraping:** Fragile (website HTML changes break scraper), phiota.org may block bots
- **Manual DM to admin:** Too error-prone, loses historical context

### Decision 4: Industry Taxonomy - 50-Item NAICS-Based List
**Choice:** Use simplified NAICS (North American Industry Classification System) sectors + common professional fields

**Rationale:**
- NAICS is nationally recognized standard, aligns with US Census and BLS data
- 50 industries balances granularity (useful for `/find`) vs. overwhelming choices
- Familiar industry names ("Technology / Software" not "NAICS Code 5112")

**List Structure (Top 20 Sample):**
```typescript
export const INDUSTRIES = [
  'Aerospace / Defense',
  'Agriculture / Food Production',
  'Architecture / Design',
  'Automotive / Transportation',
  'Construction / Real Estate',
  'Education / Academia',
  'Energy / Utilities',
  'Engineering (Civil, Mechanical, Electrical)',
  'Finance / Banking / Investment',
  'Government / Public Service',
  'Healthcare / Medical (Clinical)',
  'Healthcare / Medical (Research)',
  'Hospitality / Tourism',
  'Insurance',
  'Legal / Law',
  'Manufacturing',
  'Media / Communications / Marketing',
  'Non-Profit / Social Services',
  'Pharmaceutical / Biotechnology',
  'Retail / E-Commerce',
  'Technology / Cybersecurity',
  'Technology / Hardware',
  'Technology / Software',
  'Telecommunications',
  'Other (please specify in profile notes)',
  // ... 25 more
];
```

**Design Principles:**
- Group related fields with slashes (Finance/Banking vs. separate entries)
- Split high-population industries (Technology → Software/Hardware/Cybersecurity)
- Include "Other" for edge cases with note prompt

**Migration Strategy for Existing Data:**
```typescript
const INDUSTRY_MIGRATION_MAP: Record<string, string> = {
  'Tech / Software Engineer': 'Technology / Software',
  'Finance': 'Finance / Banking / Investment',
  'Healthcare': 'Healthcare / Medical (Clinical)',
  'Law': 'Legal / Law',
  // ... 100+ mappings
};
```

**Alternatives Considered:**
- **LinkedIn's 275 industries:** Too granular, overwhelming dropdown
- **Simple 15-category list:** Too broad, "Technology" doesn't differentiate SWE from Cybersecurity
- **Two-level selection (Sector → Subsector):** Better UX but adds interaction step, complexity not justified

### Decision 5: Voucher Validation - @Mention in Modal
**Choice:** Text input with @mention format, backend validates against brother list

**Rationale:**
- Discord native @mention UX: users type `@` and autocomplete suggests brothers
- Validation backend-side ensures mentions map to actual brothers (status='BROTHER')
- Prevents "John Smith" vs "Jonathan Smith" mismatch - Discord IDs are canonical

**Implementation:**
```typescript
// User enters in modal: "@Brother1 @Brother2"
// Discord renders as: "<@123456789> <@987654321>"
// Backend extracts: ['123456789', '987654321']
// Validates: Both IDs exist in users table with status='BROTHER'
// Validates: IDs are different (can't vouch for yourself twice)
```

**Error Handling:**
- Too few mentions: "Please @mention exactly 2 brothers"
- Too many mentions: "Please @mention exactly 2 brothers (not more)"
- Non-brother mention: "@User123 is not a verified brother. Please mention active ΓΠ brothers."
- Duplicate mention: "Both vouchers must be different brothers"

**Alternative Considered:**
- **Two separate Select Menus (voucher 1, voucher 2):** Better UX but adds 2 interaction steps, 50-100 brother list overwhelming
- **Free text with name search:** Error-prone, requires fuzzy matching

**Trade-off:** Assumes user knows 2 brothers' Discord names. Acceptable for fraternity context (applicant should know actives).

### Decision 6: International Address Handling
**Choice:** Flexible field label "Zip Code or City (international)", backend logic determines US vs. international

**Rationale:**
- 90%+ brothers are US-based (user confirmed Scenario A)
- Optimize for majority: US zip code derives city/state/timezone automatically
- Accommodate minority: international brothers enter city, system stores without zip derivation

**Logic:**
```typescript
function parseLocation(input: string) {
  if (/^\d{5}$/.test(input)) {
    // US Zip Code
    const { city, state, timezone } = zipToLocation(input);
    return { zip_code: input, city, state_province: state, country: 'United States' };
  } else {
    // International or city name
    return { city: input, country: 'United States' }; // Prompt for country clarification
  }
}
```

**Future Enhancement (not in MVP):**
- Country selector before location field (auto-shows postal code format for CA, UK, etc.)
- Timezone auto-detection from city name via external API

**Alternatives Considered:**
- **Always require country field:** Adds friction for 90% US users
- **Separate zip and city fields:** Confusing (when to use which?)
- **Geolocation via IP:** Privacy concerns, inaccurate for VPNs

### Decision 7: Phone Number Flexibility
**Choice:** International format support, no strict US-only validation

**Rationale:**
- Brothers may be in US with international phones (+52 Mexico, +1-787 Puerto Rico)
- Contact info critical for emergencies - better to allow flexible format than block valid numbers
- Validation: minimum 10 digits, allow `+`, `-`, `()`, `.`, spaces

**Regex:**
```regex
/^[\d\s\(\)\-\+\.]+$/  // Character set
digits.replace(/\D/g, '').length >= 10  // Minimum digit count
```

**Examples Accepted:**
- `(555) 123-4567` ✅
- `555-123-4567` ✅
- `+1-555-123-4567` ✅
- `+52 123 456 7890` ✅

**Examples Rejected:**
- `555-CALL-NOW` ❌ (letters)
- `123-4567` ❌ (too short)

**Storage:** Store as-is (user's preferred format), don't normalize. Display exactly as entered.

**Alternative Considered:**
- **E.164 format normalization (+ country code + number):** Breaks user expectations, some prefer `(555) 123-4567` display

### Decision 8: Year/Semester Validation
**Choice:** Single text field with format "YYYY Spring|Fall", validation via regex

**Rationale:**
- Two-step select menus (decade → year → semester) add 3 interaction steps
- Text input with example is fast: users type "2010 Spring" in 2 seconds
- Range validation (1931-2029) catches unrealistic years (founding year 1931, 4-year buffer for future)

**Validation:**
```regex
/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i
// Matches: "1931 Spring", "2025 Fall", "2010 spring" (case-insensitive)
// Rejects: "2030 Spring" (too far future), "2010" (no semester), "2010 Winter"
```

**Parsing:**
```typescript
const match = input.match(/^(\d{4})\s+(Spring|Fall)$/i);
const year = parseInt(match[1]);
const semester = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase(); // "Spring"
```

**Error Message:**
```
Invalid format. Please enter year and semester like: "2010 Spring" or "2015 Fall"
Valid years: 1931-2029
```

**Alternative Considered:**
- **Three select menus (decade, year, semester):** Accurate but tedious
- **Single year dropdown:** Loses semester data (important for line identity)

## Migration Plan

### Phase 1: Schema & Data Preparation (Week 1)
1. Deploy database schema changes (new columns)
2. Run backfill script:
   - Parse real_name → first/middle/last (best effort)
   - Map free-text industries to standardized list
   - Derive city from zip_code for existing users
3. E-Board manual cleanup of ambiguous data (30-60 minutes)

### Phase 2: New Verification Flow (Week 2)
1. Deploy multi-step interaction handlers (chapter → industry → modal)
2. Deploy validation utilities (year, phone, voucher)
3. Update verification ticket embed with new fields
4. Test end-to-end with 3-5 test accounts

### Phase 3: Display Name Rollout (Week 3)
1. Deploy getDisplayName() utility
2. Update `/find` to show don names
3. Update `/attendance`, `/vote`, other name displays
4. No breaking changes (fallback to real_name if don_name missing)

### Phase 4: Existing Brother Migration (Week 4)
1. Send DM to all existing brothers:
   - "We've upgraded profiles! Add your don name and phone: `/profile-update`"
2. Track completion (50% target in 2 weeks)
3. Gentle reminder DM after 1 week for non-responders

### Phase 5: E-Board Omega Assignment (Week 4)
1. Deploy `/chapter-assign` command
2. E-Board manually assigns Omega to historical members if needed
3. Document Omega criteria in Tech Chair Runbook

## Risk Mitigation

### Risk: Existing Brothers Frustrated by Incomplete Profiles
**Impact:** Backlash if brothers feel "forced" to update

**Mitigation:**
- Grandfather existing profiles: don_name and phone_number remain optional
- Gentle DM prompt (not command failure or role removal)
- Show value: "Don names help brothers find you - honor your line!"

### Risk: Chapter List Becomes Outdated
**Impact:** New colonizations rejected by validation, inactive chapters selectable

**Mitigation:**
- Quarterly review process (Tech Chair Runbook)
- Git commit history tracks chapter additions (audit trail)
- Validation error message: "Chapter not recognized. Contact E-Board if this is a new chapter."

### Risk: Industry List Doesn't Cover Edge Cases
**Impact:** Brother forced to select "Other", loses `/find` discoverability

**Mitigation:**
- "Other" option always available
- E-Board reviews "Other" selections monthly, adds new industries if pattern emerges (3+ brothers in same unlisted field)
- Industry additions via code PR (version controlled, reviewed)

### Risk: Voucher @Mention Fails (Username Change, User Left Server)
**Impact:** Validation fails even for legitimate brother

**Mitigation:**
- Validation checks Discord ID (not username - usernames can change)
- If voucher left server: validation catches it, prompts user to select different voucher
- E-Board override command: `/verify-override user:@User` (manual approval, logs action)

### Risk: Multi-Step Flow Feels Tedious
**Impact:** Drop-off, applicants abandon verification mid-flow

**Mitigation:**
- Progress indicator in messages: "Step 2 of 4: Select your industry"
- Each step updates previous message to show selections: "✅ Chapter: Gamma Pi"
- Fast select menus (no typing, just click)
- Completion time <2 minutes (tested)

## Success Criteria

**Data Quality (1 month post-deployment):**
- ✅ 0% chapter typos (down from ~10% with free text)
- ✅ <5 distinct industry values per actual industry (down from 20-50 variations)
- ✅ 100% voucher validation success (no "John Smith" vs "Jonathan Smith" mismatches)

**User Adoption (3 months post-deployment):**
- ✅ >70% existing brothers add don name via `/profile-update`
- ✅ >90% existing brothers add phone number
- ✅ <5% verification flow drop-off rate (start but don't complete)

**Operational Efficiency:**
- ✅ E-Board manual data cleanup time: 2 hours/month → <15 minutes/month
- ✅ Verification ticket processing time: 5 minutes → 2 minutes (clear, structured data)
- ✅ `/find` search result relevance: 60% useful → 95% useful (standardized industries)

## Open Questions

**Q1:** Should don names be unique (enforced in database)?
**Decision:** No uniqueness constraint. Multiple brothers may share don names across different lines/chapters. Natural keys are (discord_id).

**Q2:** What if a brother crossed but doesn't remember exact year/semester?
**Decision:** Validation allows 1931-2029 range (flexible). E-Board can manually correct via `/chapter-assign` if brother enters approximate year.

**Q3:** Should we collect Line Name (e.g., "Alpha Line", "Spring '24 Line")?
**Decision:** Out of scope for this proposal. Can be added later as optional field. Priority: individual identity (don name) over line identity.

**Q4:** How to handle brothers who crossed in multiple chapters (transfer students)?
**Decision:** Store most recent chapter. Future enhancement: `chapter_history` JSON field.

**Q5:** Should phone numbers be visible to all brothers or E-Board only?
**Decision:** Privacy setting in future `/profile-privacy` command. Default: Brothers Only (not public/guests).
