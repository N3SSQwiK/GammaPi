# Networking Specification Deltas

## ADDED Requirements

### Requirement: LinkedIn Profile Linking
The system SHALL allow brothers to link their LinkedIn profiles for enhanced networking and automated milestone detection.

#### Scenario: Link LinkedIn profile
- **WHEN** a brother executes `/linkedin link`
- **THEN** the system initiates OAuth flow (if API available)
- **OR** prompts for manual LinkedIn URL entry (fallback)
- **IF** OAuth: redirects to LinkedIn consent screen
- **IF** Manual: validates URL format (linkedin.com/in/[username])
- **AND** stores linkedin_url in `linkedin_profiles` table

#### Scenario: View brother LinkedIn profiles
- **WHEN** a brother executes `/find` with results displayed
- **THEN** each result includes LinkedIn profile link (if available)
- **AND** shows "Profile Linked" badge for brothers with connected profiles

#### Scenario: LinkedIn profile in verification
- **WHEN** new brother completes verification form
- **THEN** the system prompts for LinkedIn profile URL (optional field)
- **IF** provided, stores in linkedin_profiles table
- **AND** suggests: "Link your profile to celebrate career milestones automatically!"

### Requirement: Industry Trending Topics from LinkedIn
The system SHALL leverage LinkedIn trending data to generate timely professional discussions.

#### Scenario: Fetch trending hashtags
- **WHEN** weekly trending topics workflow runs (Sunday 8pm)
- **THEN** the system queries LinkedIn API for trending hashtags
- **AND** filters by industries present in brother profiles (Tech, Finance, Healthcare, etc.)
- **OR** uses manual seed list if API unavailable
- **AND** ranks by brother industry coverage (how many brothers work in that field)

#### Scenario: Generate Industry Pulse from LinkedIn trends
- **WHEN** top 3 trending topics identified
- **THEN** the system generates discussion starters:
  - Template: "[Trending Topic] is gaining traction in [Industry]. Any ΓΠ brothers working on this?"
  - Includes LinkedIn hashtag for context
  - Auto-tags brothers in matching industry (using `/find` data)
- **AND** posts to appropriate channel (career-center or industry-specific)
- **AND** schedules for Monday 9am posting (reuses Industry Pulse from add-interactive-content)

#### Scenario: Trending topic engagement attribution
- **WHEN** brother responds to LinkedIn-sourced Industry Pulse post
- **THEN** the system records engagement as "linkedin_trend_response"
- **AND** tracks which trending topics generate most discussion
- **AND** uses data to refine topic selection algorithm

### Requirement: LinkedIn OAuth Guest Verification
The system SHALL optionally use LinkedIn OAuth to verify guests/candidates are real professionals.

#### Scenario: Guest chooses LinkedIn verification
- **WHEN** guest selects "I am a Guest / Interest" in welcome gate
- **THEN** the system presents two verification options:
  - "Sign in with LinkedIn" (primary)
  - "Manual verification by brother" (fallback)

#### Scenario: LinkedIn OAuth verification flow
- **WHEN** guest clicks "Sign in with LinkedIn"
- **THEN** the system initiates OAuth flow with scopes: r_liteprofile, r_emailaddress
- **AND** redirects to LinkedIn consent screen

#### Scenario: LinkedIn profile validation
- **WHEN** OAuth callback returns profile data
- **THEN** the system validates profile quality:
  - Account age >6 months (real profile, not bot)
  - Connections count >50 (established professional)
  - Profile photo exists (completeness indicator)
- **IF** all checks pass, grant "Guest" role
- **IF** checks fail, prompt for manual brother vouching instead

#### Scenario: LinkedIn verification privacy
- **WHEN** guest completes LinkedIn OAuth verification
- **THEN** the system stores only: name, email, profile_url
- **AND** does not access: posts, connections list, employment history beyond current
- **AND** provides privacy notice: "We only verify you're a real professional. Your LinkedIn activity stays private."
- **AND** allows guest to revoke access anytime via `/linkedin unlink`

### Requirement: LinkedIn Bridge Fallback Strategies
The system SHALL provide manual workflows when LinkedIn API is unavailable or rate-limited.

#### Scenario: API access not available
- **WHEN** LinkedIn API credentials not configured or approval pending
- **THEN** the system uses manual workflows:
  - Career milestones: Brothers use `/wins` command with LinkedIn import
  - Amplification: E-Board manually posts LinkedIn links to Discord
  - Trending topics: Weekly seed list from manual research
- **AND** displays admin notice: "LinkedIn automation paused - using manual workflows"

#### Scenario: Rate limit exceeded
- **WHEN** daily API request limit reached (500 requests)
- **THEN** the system pauses all LinkedIn automation
- **AND** queues pending requests for next 24-hour window
- **AND** sends alert to `#officer-chat`: "LinkedIn API limit reached - automation resuming [timestamp]"
- **AND** logs event for rate limit optimization

#### Scenario: Gradual automation transition
- **WHEN** LinkedIn API access becomes available
- **THEN** the system enables features incrementally:
  - Phase 1: Manual LinkedIn URL collection + storage
  - Phase 2: OAuth verification for new guests
  - Phase 3: Profile monitoring for career milestones
  - Phase 4: Company page amplification
  - Phase 5: Trending topics integration
- **AND** documents each phase activation in Tech Chair Runbook
