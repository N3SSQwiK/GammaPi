# Implementation Tasks: Engagement Infrastructure

## 1. Database Schema
- [ ] 1.1 Create `digest_subscriptions` table (user_id, email, subscribed, last_sent)
- [ ] 1.2 Create `digest_analytics` table (id, user_id, sent_at, opened_at, clicks)
- [ ] 1.3 Create `knowledge_vault_entries` table (id, author_id, title, content, category, upvotes, created_at)
- [ ] 1.4 Create `vault_upvotes` table (entry_id, user_id, timestamp)
- [ ] 1.5 Create KnowledgeRepository for vault CRUD operations

## 2. The Pulse Weekly Digest
- [ ] 2.1 Implement `/pulse subscribe` command for brothers to opt-in with email
- [ ] 2.2 Create n8n workflow for Friday 4pm digest compilation:
  - [ ] Query top 3 discussions (by reply/reaction count)
  - [ ] Fetch upcoming events from calendar
  - [ ] Pull new job posts from `career-center`
  - [ ] Retrieve achievement unlocks and wins from week
  - [ ] Compile brother spotlight if published this week
- [ ] 2.3 Build email template with sections:
  - [ ] Header: "The Pulse - ΓΠ Weekly Digest for [Date Range]"
  - [ ] Top Discussions (3 threads with excerpt + link)
  - [ ] Upcoming Events (with Discord event links)
  - [ ] Career Opportunities (job posts from week)
  - [ ] Brotherhood Wins (achievements and promotions)
  - [ ] Footer: "Manage subscription | View in Discord"
- [ ] 2.4 Integrate email delivery service (SendGrid/Mailgun)
- [ ] 2.5 Add UTM parameters to all links for open/click tracking
- [ ] 2.6 Implement `/pulse unsubscribe` command

## 3. Knowledge Vault Forum
- [ ] 3.1 Add `knowledge-vault` forum to serverConfig.ts with tags:
  - [ ] 💼 Career (resumes, interviews, negotiations)
  - [ ] 💰 Finance (budgeting, investing, taxes)
  - [ ] 🏠 Life Skills (homebuying, insurance, cooking)
  - [ ] 🚀 Industry Primers (tech, healthcare, law, etc.)
  - [ ] 📚 Education (grad school, certs, learning resources)
- [ ] 3.2 Set forum guidelines: "Share 1-paragraph pro tips. One topic per thread. Community upvotes the best."
- [ ] 3.3 Implement auto-react ⭐ when thread reaches 5+ upvotes
- [ ] 3.4 Create `/vault search` command to find entries by keyword or category
- [ ] 3.5 Build monthly "Top Tips" compilation (posts threads with 10+ upvotes to #announcements)

## 4. Engagement Loop Integration
- [ ] 4.1 Track vault contributions in engagement metrics
- [ ] 4.2 Define "Curator" achievement: Post 5 knowledge vault entries
- [ ] 4.3 Define "Sage" achievement: Knowledge vault entry receives 25+ upvotes
- [ ] 4.4 Define "Pulse Contributor" achievement: Content featured in 3 weekly digests
- [ ] 4.5 Add achievement unlock triggers for vault and digest metrics

## 5. Analytics & Optimization
- [ ] 5.1 Track digest open rates and click-through rates per link
- [ ] 5.2 Identify which content types drive most engagement (discussions vs jobs vs wins)
- [ ] 5.3 A/B test send times (Friday 4pm vs Monday 8am) with subset
- [ ] 5.4 Monitor vault contribution rate and adjust promotion strategy
- [ ] 5.5 Create monthly engagement report including digest metrics

## 6. Integration & Testing
- [ ] 6.1 Test digest compilation with full week of mock data
- [ ] 6.2 Verify email template rendering across clients (Gmail, Outlook, mobile)
- [ ] 6.3 Test UTM tracking and analytics pipeline
- [ ] 6.4 Validate vault search across categories
- [ ] 6.5 Test monthly Top Tips compilation automation
- [ ] 6.6 Run `/setup` to create knowledge-vault forum in test server

## 7. Documentation
- [ ] 7.1 Create Pulse Digest subscriber guide
- [ ] 7.2 Document Knowledge Vault contribution best practices
- [ ] 7.3 Add email template customization guide for future branding
- [ ] 7.4 Update Tech Chair Runbook with digest troubleshooting
- [ ] 7.5 Update CLAUDE.md and GEMINI.md with engagement infrastructure
