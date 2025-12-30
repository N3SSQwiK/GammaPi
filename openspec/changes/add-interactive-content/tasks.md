# Implementation Tasks: Interactive Content Features

## 1. Database Schema
- [ ] 1.1 Create `quiz_responses` table (user_id, quiz_id, choice, is_correct, timestamp)
- [ ] 1.2 Create `spotlight_schedule` table (user_id, scheduled_date, submission_status, content)
- [ ] 1.3 Create `engagement_metrics` table (user_id, metric_type, value, period)
- [ ] 1.4 Create EngagementRepository with methods for leaderboards and tracking

## 2. Pop Quiz System
- [ ] 2.1 Extend `n8n_workflow_v2.json` to generate quiz questions via Gemini
- [ ] 2.2 Add 1-hour delayed trigger to post Discord poll
- [ ] 2.3 Implement quiz answer webhook to track responses
- [ ] 2.4 Create `/quiz-stats` command to show leaderboard
- [ ] 2.5 Add monthly "Historia Champion" announcement automation

## 3. Brother Spotlight Series
- [ ] 3.1 Create n8n workflow for weekly spotlight scheduling
- [ ] 3.2 Implement Discord form for brothers to submit 3-sentence bio
- [ ] 3.3 Build auto-rotation logic (random selection from unspotlighted brothers)
- [ ] 3.4 Create Friday 5pm posting automation to `lions-den` forum
- [ ] 3.5 Add `/spotlight volunteer` command for early sign-up

## 4. Industry Pulse Discussions
- [ ] 4.1 Create n8n workflow to fetch trending LinkedIn hashtags (or manual seed list)
- [ ] 4.2 Build logic to match hashtags to brother industries using `/find` data
- [ ] 4.3 Implement auto-tagging of relevant brothers in discussion posts
- [ ] 4.4 Schedule weekly Monday 9am posts to appropriate channels
- [ ] 4.5 Add conversation starter templates

## 5. Integration & Testing
- [ ] 5.1 Test quiz workflow end-to-end (post → response → leaderboard)
- [ ] 5.2 Test spotlight rotation with multiple brothers
- [ ] 5.3 Verify Industry Pulse tagging accuracy
- [ ] 5.4 Document configuration in FiotaBot_Implementation_SOP.md
- [ ] 5.5 Update serverConfig.ts if new channels required

## 6. Documentation
- [ ] 6.1 Add engagement metrics to Tech Chair Runbook
- [ ] 6.2 Document quiz question authoring guidelines
- [ ] 6.3 Create Brother Spotlight submission guide
- [ ] 6.4 Update CLAUDE.md and GEMINI.md with new features
