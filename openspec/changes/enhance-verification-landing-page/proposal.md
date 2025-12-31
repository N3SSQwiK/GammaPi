# Change: Enhance Verification Landing Page

## Why
The verification gate is the first interaction new members have with the Gamma Pi Discord server. Currently it's a plain text embed with a single button. A visually engaging, fraternity-themed landing page will create a stronger first impression and reinforce the professional, brotherhood-focused culture of Phi Iota Alpha.

## What Changes
- Add custom imagery to the verification gate embed (chapter crest, banner image)
- Apply fraternity branding (color palette, themed visual elements)
- Refine copy for professional/formal tone with lion imagery references
- Update choice screen and subsequent screens for visual consistency
- Define image hosting strategy for embed assets

## Impact
- Affected specs: `access-control` (verification gate flow)
- Affected code:
  - `fiota-bot/src/commands/verify.ts` (main gate embed)
  - `fiota-bot/src/modules/access/accessHandler.ts` (choice/brother/guest screens)
- Assets needed: Hosted images (crest, banner)

## Design Constraints
Discord embeds support:
- Color (hex) - already using `#B41528`
- Thumbnail (small image, top-right, 80x80)
- Image (large, bottom of embed)
- Author with icon (top of embed)
- Footer with icon

Discord embeds do NOT support:
- Custom fonts
- Background images
- CSS styling
- Multiple inline images

## Open Questions
1. Where will images be hosted? (Discord CDN via upload, external URL, bot server?)
2. What specific images will be used? (chapter crest, lion imagery, banner design?)
3. Should the choice screen (ephemeral) also have imagery, or just the main gate?
