# Change: Engagement Infrastructure (Pulse Digest & Knowledge Vault)

## Why

Busy professionals cannot monitor Discord daily, leading to FOMO and disengagement. Critical updates get buried in notification noise. Additionally, valuable knowledge shared in discussions (resume tips, negotiation tactics, industry primers) is ephemeral - disappearing into channel history. We need infrastructure to bring Discord to brothers via email AND preserve institutional wisdom for future reference.

## What Changes

- **The Pulse Weekly Digest**: Automated Friday 4pm email summarizing the week's top content (discussions, events, job posts, achievements) with click-to-join links. Drives re-engagement by surfacing what matters without requiring daily monitoring.
- **Knowledge Vault**: Crowdsourced professional tips library in forum format. Brothers contribute 1-paragraph "pro tips" (resume templates, negotiation tactics, industry primers) with community upvoting. Monthly digest highlights top contributions.
- **Engagement Loop Closure**: Both features feed back into achievement system - "Curator" badge for 5 vault contributions, "Pulse Contributor" for top-featured content.

All features use lightweight automation (n8n for digest, Discord forum for vault) with minimal manual curation.

## Impact

- **Affected specs**:
  - `bot-core` - Add digest generation engine, knowledge vault moderation
  - `operations` - Add engagement metrics from digest opens and vault contributions
- **Affected code**:
  - New n8n workflow for weekly digest compilation and email delivery
  - `fiota-bot/src/modules/operations/` - Add digestHandler.ts, vaultHandler.ts
  - `fiota-bot/src/lib/repositories/` - Add KnowledgeRepository for vault entries
  - `serverConfig.ts` - Add `knowledge-vault` forum channel
- **External dependencies**:
  - Email service integration (SendGrid, Mailgun, or SMTP)
  - Optional: Analytics tracking for digest opens (UTM parameters)
- **New features**:
  - Weekly email digest system
  - Knowledge vault forum with quality tracking
  - Curator achievements
- **Migration**: Create knowledge-vault forum via `/setup` command
