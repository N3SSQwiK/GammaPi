# Access Control - Landing Page Enhancement Delta

## MODIFIED Requirements

### Requirement: Verification Gate Embed
The `/verify` command SHALL post a visually-branded verification gate embed that includes:
- **Author**: Fraternity name with chapter crest icon
- **Title**: Welcome message with lion emoji
- **Color**: Fraternity red (`#B41528`)
- **Description**: Professional welcome copy explaining the server purpose
- **Thumbnail**: Chapter crest or fraternity logo (small, top-right)
- **Image**: Full-width banner image (fraternity/lion themed)
- **Fields**: Brief descriptions of Brother and Guest access paths
- **Footer**: Fraternity motto with icon
- **Button**: Single "Get Verified" button to initiate the flow

The embed SHALL convey a formal, professional, brotherhood-focused tone.

#### Scenario: User views verification gate
- **WHEN** an admin runs `/verify` in a channel
- **THEN** a branded embed is posted with:
  - Chapter crest as thumbnail and author icon
  - Banner image at the bottom
  - Fraternity red color theme
  - "Get Verified" button

#### Scenario: Images fail to load
- **WHEN** embed images are unavailable (hosting issue)
- **THEN** the embed remains functional with text content intact
- **AND** the button still initiates the verification flow

### Requirement: Verification Choice Screen
The verification choice screen (ephemeral) SHALL maintain visual consistency with the main gate:
- **Color**: Fraternity red (`#B41528`)
- **Title**: Clear path selection prompt
- **Fields**: Brother and Guest option descriptions
- **Footer**: Fraternity motto

The choice screen MAY include a thumbnail image for branding consistency.

#### Scenario: User clicks Get Verified
- **WHEN** user clicks the "Get Verified" button
- **THEN** an ephemeral message appears with:
  - Consistent fraternity branding
  - "I'm a Brother" button (red/danger style)
  - "I'm a Guest" button (secondary style)
  - "Cancel" button

### Requirement: Brother Verification Screen
The brother verification instructions screen SHALL:
- Display instructions for the `/verify-start` command
- Maintain visual consistency with the gate (color, footer)
- Include a "Back" button to return to the choice screen

#### Scenario: User selects Brother path
- **WHEN** user clicks "I'm a Brother"
- **THEN** instructions are displayed with consistent branding
- **AND** a "Back" button allows returning to the choice screen

### Requirement: Guest Access Screen
The guest access screen SHALL:
- Explain guest access limitations and benefits
- Maintain visual consistency with the gate (color, footer)
- Include a "Back" button to return to the choice screen

#### Scenario: User selects Guest path
- **WHEN** user clicks "I'm a Guest"
- **THEN** guest information is displayed with consistent branding
- **AND** a "Back" button allows returning to the choice screen
