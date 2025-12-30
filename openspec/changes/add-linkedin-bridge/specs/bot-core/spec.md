# Bot Core Specification Deltas

## ADDED Requirements

### Requirement: LinkedIn API Integration
The system SHALL integrate with LinkedIn API to enable automated profile monitoring and OAuth verification.

#### Scenario: LinkedIn OAuth authentication
- **WHEN** a user initiates LinkedIn OAuth flow (guest verification or profile linking)
- **THEN** the system redirects to LinkedIn OAuth consent screen
- **AND** includes scope: r_liteprofile, r_emailaddress
- **AND** generates unique state parameter to prevent CSRF attacks
- **AND** records session in `linkedin_oauth_sessions` table

#### Scenario: OAuth callback handling
- **WHEN** LinkedIn redirects back with authorization code
- **THEN** the system validates state parameter matches session
- **AND** exchanges code for access token via linkedinClient.authenticateOAuth()
- **IF** successful, fetches profile data (name, email, profile URL, connections count)
- **AND** stores profile_data in `linkedin_profiles` table
- **AND** marks session as completed_at with current timestamp

#### Scenario: Token refresh
- **WHEN** LinkedIn access token expires (60 days)
- **THEN** the system attempts to refresh token using refresh token
- **IF** refresh fails, prompts brother to re-authenticate via DM
- **AND** logs token expiration event for monitoring

#### Scenario: Rate limit protection
- **WHEN** LinkedIn API request is about to be made
- **THEN** the system checks recent request count (500/day limit for free tier)
- **IF** approaching limit (>450 requests), throttle requests and queue
- **IF** limit exceeded, pause automation and alert E-Board via `#officer-chat`

### Requirement: Career Milestone Automated Detection
The system SHALL monitor brother LinkedIn profiles for career changes and auto-celebrate in Discord.

#### Scenario: Daily profile monitoring
- **WHEN** daily profile check workflow runs (8am)
- **THEN** the system iterates through all brothers with linked LinkedIn profiles
- **AND** fetches current profile data via linkedinClient.getProfile()
- **AND** compares current job title/company/certifications to stored profile_data
- **IF** changes detected, records milestone in `linkedin_milestones` table

#### Scenario: Milestone type detection
- **WHEN** profile comparison identifies change
- **THEN** the system classifies milestone type:
  - Job Change: company changed, title similar
  - Promotion: same company, senior title
  - New Certification: certifications list expanded
  - Education Completed: education list expanded
- **AND** extracts relevant details (new title, new company, certification name)

#### Scenario: Milestone celebration posting
- **WHEN** new milestone is detected and not yet posted
- **THEN** the system generates formatted embed:
  - Title: "🎉 LinkedIn Update: [Milestone Type]"
  - Description: "@Brother is now [Title] at [Company]"
  - Include LinkedIn profile link
  - Timestamp of detection
- **AND** posts to wins channel
- **AND** marks posted_to_discord=true in `linkedin_milestones` table
- **AND** awards progress toward relevant achievement (same as manual `/wins`)

#### Scenario: False positive mitigation
- **WHEN** milestone detection fires but appears to be profile edit (not actual change)
- **THEN** the system applies confidence scoring:
  - High confidence: company AND title changed
  - Medium confidence: title changed, same company (likely promotion)
  - Low confidence: minor wording change in same title
- **AND** only posts high/medium confidence milestones
- **AND** logs low confidence for manual E-Board review

### Requirement: Chapter Content Amplification
The system SHALL monitor Gamma Pi LinkedIn page for new posts and cross-post to Discord for brother amplification.

#### Scenario: LinkedIn page monitoring
- **WHEN** hourly page check workflow runs
- **THEN** the system fetches recent posts from Gamma Pi company page via linkedinClient.getCompanyPosts()
- **AND** compares to posts in `linkedin_amplification` table
- **IF** new post found, records post_id, url, content, posted_at

#### Scenario: Amplification cross-posting
- **WHEN** new LinkedIn post is detected
- **THEN** the system posts to `#professional-networking`:
  - Header: "📣 New on Gamma Pi LinkedIn"
  - Excerpt: First 200 chars of post
  - Direct link to LinkedIn post
  - Call-to-action: "Help amplify our chapter visibility! Like and share on LinkedIn 🚀"
- **AND** mentions @Everyone (or specific role for major announcements)

#### Scenario: Amplification engagement tracking
- **WHEN** brother clicks LinkedIn link from amplification post
- **AND** engages on LinkedIn (likes/shares/comments)
- **THEN** the system tracks engagement if LinkedIn API provides insights
- **AND** records brother_engagements count in `linkedin_amplification` table
- **AND** awards "Amplifier" achievement progress (10 engagements = unlock)

#### Scenario: Amplification analytics
- **WHEN** monthly engagement report is generated
- **THEN** the system includes LinkedIn amplification metrics:
  - Posts amplified count
  - Average Discord reactions per amplification post
  - Estimated LinkedIn reach (if API provides insights)
  - Top amplifiers (brothers with most engagements)
