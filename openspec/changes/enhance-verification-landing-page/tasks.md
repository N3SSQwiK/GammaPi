# Tasks: Enhance Verification Landing Page

## 0. Design & Assets
- [ ] 0.1 Design landing page in Discohook or similar embed visualizer
- [ ] 0.2 Finalize copy/messaging for all screens
- [ ] 0.3 Source or create chapter crest image (transparent PNG recommended)
- [ ] 0.4 Source or create banner image (fraternity/lion themed)
- [ ] 0.5 Upload images to hosting (Discord CDN, Imgur, or server)
- [ ] 0.6 Document image URLs in config or constants file

## 1. Implementation - Main Gate
- [ ] 1.1 Update `verify.ts` embed with author (crest icon + "Phi Iota Alpha Fraternity")
- [ ] 1.2 Add thumbnail image (chapter crest)
- [ ] 1.3 Add large image (banner)
- [ ] 1.4 Refine description and field copy
- [ ] 1.5 Update footer with icon

## 2. Implementation - Choice Screen
- [ ] 2.1 Update `verify_gate_start` handler embed styling
- [ ] 2.2 Add consistent branding (thumbnail/footer if applicable)
- [ ] 2.3 Refine button labels and copy

## 3. Implementation - Brother/Guest Screens
- [ ] 3.1 Update `verify_choice_brother` handler embed styling
- [ ] 3.2 Update `verify_choice_guest` handler embed styling
- [ ] 3.3 Ensure visual consistency across all screens

## 4. Testing & Validation
- [ ] 4.1 Test embed rendering in Discord (desktop + mobile)
- [ ] 4.2 Verify images load correctly
- [ ] 4.3 Test fallback if images fail to load
- [ ] 4.4 Run `/verify` command and walk through full flow

## 5. Documentation
- [ ] 5.1 Update CLAUDE.md with image asset locations
- [ ] 5.2 Document image hosting approach in runbook
