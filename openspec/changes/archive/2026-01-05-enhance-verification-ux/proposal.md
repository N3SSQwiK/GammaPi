# Change: Enhanced Verification UX with Multi-Step Flow

## Why

The current brother verification form uses a basic modal with limited input types, resulting in poor UX and data quality issues:

**Current Problems:**
1. **Name handling:** Single "Full Legal Name" field prevents proper name parsing for display and search
2. **Chapter validation:** Free-text input allows typos and non-existent chapters ("Gamma Pie" instead of "Gamma Pi")
3. **Year ambiguity:** "Chapter & Year" combines two data points, no semester tracking, no validation (someone could enter "2050")
4. **Voucher errors:** Free-text voucher names cause mismatches - "John Smith" vs "Jonathan Smith" vs "@JohnSmith"
5. **Industry inconsistency:** Free-form "Tech / Software Engineer" vs "Technology / SWE" creates duplicate categories, breaks `/find` searches
6. **Missing data:** No phone number (critical for emergency contact), no brother name (don name), no international address support
7. **Geographic limitations:** Zip code field breaks for international brothers (Canada, Puerto Rico, etc.)

These issues create:
- Manual cleanup work for E-Board (fixing typos, standardizing industries)
- Poor `/find` results (brothers can't discover each other due to inconsistent tagging)
- Incomplete member profiles (missing contact info)
- Exclusion of international brothers

## What Changes

### **Core UX Transformation**
- **Multi-step interaction flow** replacing single modal - uses Select Menus for structured data (chapter, industry), text inputs for free-form data
- **Split name fields** (First, Middle, Last) + Don Name tracking
- **Chapter dropdown** from hardcoded Phi Iota Alpha chapter list (sourced from phiota.org/chapters)
- **Year validation** with text input format "YYYY Spring/Fall" (1931-2025)
- **Industry standardization** with 50-item NAICS-based list
- **Voucher @mentions** validated against existing brother list in backend
- **Phone number** required field with international format support
- **International address support** - flexible zip/city field with country tracking
- **Don name display system** - prioritizes fraternity names in UI

### **Database Schema Updates**
```sql
-- Split name fields
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN middle_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;
ALTER TABLE users ADD COLUMN don_name TEXT; -- Fraternity nickname

-- Contact & location
ALTER TABLE users ADD COLUMN phone_number TEXT;
ALTER TABLE users ADD COLUMN city TEXT; -- For international or derived from zip
ALTER TABLE users ADD COLUMN state_province TEXT; -- For international
ALTER TABLE users ADD COLUMN country TEXT DEFAULT 'United States';

-- Verification metadata
ALTER TABLE users ADD COLUMN chapter TEXT; -- Greek letter (e.g., "Gamma Pi")
ALTER TABLE users ADD COLUMN initiation_year INTEGER;
ALTER TABLE users ADD COLUMN initiation_semester TEXT CHECK(initiation_semester IN ('Spring', 'Fall'));

-- Keep real_name as computed field for backward compatibility
-- Update trigger: real_name = first_name || ' ' || middle_name || ' ' || last_name
```

### **Form Validation Logic**
- **Chapter:** Must match hardcoded list (Alpha, Beta, Gamma Pi, etc.) - "Omega" hidden from dropdown but settable via E-Board command
- **Year/Semester:** Regex `/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/` - validates 1931-2029, must include semester
- **Voucher @mentions:** Validates mentioned users exist in database with `status='BROTHER'`
- **Industry:** Must select from 50-item list, no free-text
- **Phone:** Regex `/^[\d\s\(\)\-\+\.]+$/` - allows international formats, minimum 10 digits
- **Zip/City:** If 5 digits → US zip (derive city/state/timezone), else → store as city, prompt for country

### **Brother Name Display System**
All brother displays across Discord (embeds, select menus, messages) follow priority:
1. **If don_name exists:** "Don {don_name} ({first_name} {last_name})"
2. **If no don_name:** "{first_name} {last_name}"

Examples:
- "Don Phoenix (John Smith)"
- "Don Nexus (Maria Garcia)"
- "Robert Johnson" (no don name yet)

## Impact

### **Affected specs:**
- `access-control` - Complete verification flow redesign, voucher validation logic
- `identity` - Name parsing, display name system, international address handling
- `bot-core` - Chapter/industry constants, validation utilities, E-Board Omega assignment

### **Affected code:**
- `fiota-bot/src/modules/access/accessHandler.ts` - Complete rewrite of modal → multi-step flow
- `fiota-bot/src/lib/repositories/userRepository.ts` - Add fields, update upsert logic, add name/display helpers
- `fiota-bot/src/lib/db.ts` - Schema migrations for new columns
- `fiota-bot/src/modules/identity/` - New displayNameBuilder.ts utility
- `fiota-bot/src/commands/verify.ts` - Update embed to explain multi-step flow
- All existing commands that display names (`/find`, `/attendance`, `/vote`) - Update to use don name priority
- `serverConfig.ts` - Add CHAPTERS and INDUSTRIES constants

### **New features:**
- Chapter dropdown (sourced from national website)
- Industry standardization (50 NAICS-based categories)
- Don name tracking and display
- International address support
- Phone number collection
- Year/semester tracking
- Improved voucher validation

### **Data Migration:**
Existing brothers in database need backfill:
- Parse existing `real_name` into first/middle/last (best effort, may need manual cleanup)
- Parse existing `industry` and map to new standardized list
- Prompt existing brothers to add don_name, phone_number via `/profile update` command

### **External dependencies:**
- Phi Iota Alpha chapter list from phiota.org/chapters (manual entry into code)
- NAICS industry taxonomy for 50-item list
- US zip code to city/state database (existing in identity spec)

### **Breaking changes:**
- **BREAKING:** Verification modal fields completely changed - any in-flight verification tickets may need manual processing
- **BREAKING:** `users.real_name` becomes computed field - existing queries need update to use first_name/last_name
- **BREAKING:** `users.industry` values will change - existing data needs migration mapping

### **Migration plan:**
1. Deploy schema changes (new columns)
2. Backfill script: parse existing real_name → first/last, map industries
3. Deploy new verification flow
4. Manual cleanup: E-Board reviews unmapped industries, incomplete profiles
5. Prompt existing brothers: "Update your profile with don name and phone: `/profile update`"

## Risk Mitigation

**Risk:** Chapter list becomes outdated (new chapters colonized, chapters close)
**Mitigation:** Document chapter list update process in Tech Chair Runbook, check phiota.org quarterly

**Risk:** Industry list doesn't cover all brothers' fields
**Mitigation:** Include "Other (specify in notes)" option, E-Board can request new categories

**Risk:** International brothers confused by US-centric zip code field
**Mitigation:** Field label "Zip Code or City (international)", clear helper text

**Risk:** Existing brothers frustrated by profile incompleteness
**Mitigation:** Grandfather existing profiles (don't require backfill), prompt gently via DM

**Risk:** @mention voucher validation fails if voucher changed Discord username
**Mitigation:** Validate against Discord ID (not username), allow E-Board manual override
