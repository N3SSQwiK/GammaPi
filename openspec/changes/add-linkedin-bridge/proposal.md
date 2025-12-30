# Change: LinkedIn Integration Bridge

## Why

Brothers are highly active on LinkedIn (professional necessity) but passively engaged on Discord. The platforms operate in silos - professional wins announced on LinkedIn aren't celebrated in Discord, chapter content doesn't get LinkedIn amplification, and trending professional topics remain disconnected from brotherhood discussions. We need bidirectional flow: bring LinkedIn activity INTO Discord for celebration AND push Discord content OUT to LinkedIn for chapter visibility.

**Migration Report Context:** The original migration strategy (GammaPi_Discord_Migration_Report.md section 4.1) identified LinkedIn integration as critical for professional chapters. This proposal implements that vision.

## What Changes

- **LinkedIn Activity Detection**: Automated monitoring of brother LinkedIn profiles for career milestones (promotions, certifications, new positions) using LinkedIn API. Auto-posts celebrations to Discord wins channel.
- **Chapter Content Amplification**: When official Gamma Pi posts to LinkedIn, auto-share to Discord with "Help amplify - like/share to boost algorithm visibility" call-to-action. Tracks brother participation.
- **Trending Topics Bridge**: Fetches trending LinkedIn hashtags in brothers' industries, generates Industry Pulse discussion starters in Discord. Creates professional relevance loop.
- **Optional OAuth Verification**: Leverage LinkedIn OAuth (mentioned in Migration Report) for guest verification - confirms real, aged profiles to combat spam/bots.

**Complexity Note:** This proposal requires LinkedIn API setup (Developer Application, API keys). Implementation may need phasing: start with manual LinkedIn→Discord sharing, automate when API access secured.

## Impact

- **Affected specs**:
  - `bot-core` - Add LinkedIn API integration, OAuth verification flow
  - `networking` - Add trending topics fetching, profile monitoring
- **Affected code**:
  - New n8n workflows for LinkedIn API polling and webhook handling
  - `fiota-bot/src/lib/` - Add linkedinClient.ts for API wrapper
  - `fiota-bot/src/modules/networking/` - Add linkedinBridgeHandler.ts
  - `fiota-bot/src/modules/access/` - Enhance accessHandler.ts for LinkedIn OAuth verification
- **External dependencies**:
  - LinkedIn Developer Application (free, requires approval)
  - LinkedIn API credentials (requires company page admin access)
  - OAuth 2.0 flow implementation
- **New features**:
  - Automated career milestone detection
  - Chapter content cross-posting
  - Industry trending topics integration
  - LinkedIn OAuth guest verification
- **Migration**: LinkedIn API setup required before automation; manual workflows available as interim solution
- **Risk**: LinkedIn API access approval not guaranteed; proposal includes fallback strategies
