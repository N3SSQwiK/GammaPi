# Bot Core Specification Deltas

## ADDED Requirements

### Requirement: Weekly Digest Subscription Management
The system SHALL allow brothers to subscribe to weekly email digests with their preferred email address.

#### Scenario: Subscribe to digest
- **WHEN** a brother executes `/pulse subscribe`
- **THEN** the system prompts for email address
- **AND** validates email format
- **IF** valid, creates record in `digest_subscriptions` with subscribed=true
- **AND** confirms via DM: "✅ Subscribed! First digest arrives Friday at 4pm."
- **AND** sends test email to verify deliverability

#### Scenario: Unsubscribe from digest
- **WHEN** a brother executes `/pulse unsubscribe`
- **THEN** the system updates their `digest_subscriptions` record to subscribed=false
- **AND** confirms via DM: "Unsubscribed from The Pulse. Re-subscribe anytime with /pulse subscribe"

#### Scenario: Update email address
- **WHEN** a subscribed brother executes `/pulse subscribe` with new email
- **THEN** the system updates their existing record with new email
- **AND** sends confirmation to both old and new addresses

### Requirement: Weekly Digest Compilation Engine
The system SHALL automatically compile and send weekly digests every Friday at 4pm.

#### Scenario: Digest content aggregation
- **WHEN** Friday 4pm arrives
- **THEN** the system queries Discord data for past 7 days:
  - Top 3 discussions (forums/channels with most replies + reactions)
  - Upcoming events (next 7 days from Discord scheduled events)
  - New job posts (from `career-center` forum tagged with 💼 Hiring)
  - Achievement unlocks (all badges earned this week)
  - Wins posted (from `/wins` submissions)
  - Brother Spotlight (if published this week)
- **AND** generates structured content object with all sections

#### Scenario: Email template generation
- **WHEN** digest content is compiled
- **THEN** the system renders HTML email template with:
  - Header: "The Pulse - ΓΠ Weekly Digest for [Date Range]"
  - Sections: Discussions, Events, Jobs, Wins, Spotlight (each with 2-3 sentence summary)
  - Call-to-action links: "View in Discord" with UTM parameters (?utm_source=pulse&utm_medium=email&utm_campaign=weekly)
  - Footer: Manage subscription link, Discord logo, chapter tagline
- **AND** generates plain-text fallback for non-HTML email clients

#### Scenario: Digest delivery
- **WHEN** email is generated
- **THEN** the system queries all subscribed brothers from `digest_subscriptions`
- **AND** sends personalized email via SendGrid/Mailgun API
- **AND** includes unsubscribe link unique to each recipient
- **AND** records sent_at timestamp in `digest_analytics` table
- **AND** logs delivery status (sent, bounced, failed) per recipient

#### Scenario: Digest analytics tracking
- **WHEN** a brother opens digest email
- **THEN** email tracking pixel fires and records opened_at in `digest_analytics`
- **WHEN** a brother clicks any link in digest
- **THEN** UTM parameters track which content type was clicked
- **AND** records click event in `digest_analytics` with link identifier

### Requirement: Knowledge Vault Forum Management
The system SHALL provide a structured forum for crowdsourced professional knowledge with quality curation.

#### Scenario: Knowledge Vault forum setup
- **WHEN** `/setup` command is executed
- **THEN** the system creates `knowledge-vault` forum channel if not exists
- **AND** configures forum tags: 💼 Career, 💰 Finance, 🏠 Life Skills, 🚀 Industry Primers, 📚 Education
- **AND** sets forum guidelines: "Share 1-paragraph pro tips on professional/life topics. One topic per thread. Upvote the best!"
- **AND** enables requireTag=true to enforce tag usage
- **AND** sets defaultReaction=⭐

#### Scenario: Brother posts vault entry
- **WHEN** a brother creates thread in `knowledge-vault` forum
- **THEN** the system requires tag selection (enforced by Discord)
- **AND** automatically adds ⭐ reaction to enable upvoting
- **AND** records entry in `knowledge_vault_entries` table
- **AND** awards progress toward "Curator" achievement

#### Scenario: Vault entry reaches quality threshold
- **WHEN** a vault thread reaches 5 ⭐ reactions
- **THEN** the system pins the thread in forum (top visibility)
- **AND** adds 🏆 reaction to signify high quality

#### Scenario: Exceptional vault entry
- **WHEN** a vault thread reaches 25 ⭐ reactions
- **THEN** the system awards "Sage" achievement to author
- **AND** features entry in next monthly digest

#### Scenario: Search knowledge vault
- **WHEN** a brother executes `/vault search query:"negotiation salary"`
- **THEN** the system searches thread titles and first message content
- **AND** returns matching threads sorted by upvote count
- **AND** includes category tag, upvote count, author, excerpt
- **AND** limits results to 10 most relevant

#### Scenario: Search by category
- **WHEN** a brother executes `/vault search category:Career`
- **THEN** the system returns all threads with Career tag
- **AND** sorts by upvote count (highest first)
- **AND** displays up to 20 results

### Requirement: Monthly Knowledge Vault Digest
The system SHALL compile and share top knowledge contributions monthly.

#### Scenario: Monthly vault compilation
- **WHEN** first Monday of month at 10am arrives
- **THEN** the system queries all vault entries from previous month
- **AND** identifies entries with 10+ upvotes
- **AND** generates "Top Tips of [Month]" post

#### Scenario: Monthly digest posting
- **WHEN** Top Tips compilation is ready
- **THEN** the system posts to `#announcements`:
  - Header: "📚 Top Knowledge from [Month]"
  - Top 5 entries with title, author, upvote count, link
  - Call to action: "Contribute your expertise in #knowledge-vault!"
- **AND** tags authors of featured entries
- **AND** posts summary to `#officer-chat` for E-Board
