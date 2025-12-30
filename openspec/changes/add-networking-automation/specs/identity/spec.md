# Identity Specification Deltas

## MODIFIED Requirements

### Requirement: Geographic Profile Data
The system SHALL automatically derive and maintain location data for brothers to enable proximity-based networking.

**[Note: This modifies existing Identity spec to add proximity calculation capabilities]**

#### Scenario: Zip code to coordinates conversion
- **WHEN** a brother's zip code is stored during verification
- **THEN** the system derives latitude/longitude centroid for that zip code
- **AND** caches coordinates in user profile for fast proximity calculations
- **AND** updates timezone, city, state as before (existing behavior preserved)

#### Scenario: Distance calculation between brothers
- **WHEN** system needs to calculate distance between two brothers
- **THEN** retrieve cached lat/long coordinates for both users
- **AND** apply Haversine formula to calculate great-circle distance in miles
- **AND** cache result for 24 hours to optimize repeated queries

#### Scenario: Regional assignment
- **WHEN** brother's location is processed
- **THEN** the system assigns to macro region based on state:
  - Northeast: ME, NH, VT, MA, RI, CT, NY, NJ, PA
  - Southeast: DE, MD, DC, VA, WV, NC, SC, GA, FL, KY, TN, AL, MS, AR, LA
  - Midwest: OH, IN, IL, MI, WI, MN, IA, MO, ND, SD, NE, KS
  - West: MT, WY, CO, NM, ID, UT, AZ, NV, WA, OR, CA, AK, HI
- **AND** stores region in user profile for clustering and channel access

## ADDED Requirements

### Requirement: Location Privacy Controls
The system SHALL respect brother privacy regarding location sharing while enabling networking features.

#### Scenario: Location visibility preference
- **WHEN** brother completes verification with zip code
- **THEN** system defaults location visibility to "Brothers Only" (not public/guests)
- **AND** allows brother to configure via `/profile-privacy` command:
  - Public: Show city/state to everyone
  - Brothers Only: Show city/state to verified brothers only (default)
  - Hidden: Show only "United States" in profile, disable proximity features
- **AND** stores preference in user profile

#### Scenario: Privacy-aware proximity matching
- **WHEN** system performs proximity calculations for pairing/clustering
- **THEN** only includes brothers with visibility "Brothers Only" or "Public"
- **AND** excludes brothers with "Hidden" privacy setting
- **AND** never exposes exact coordinates (only city/state/distance)

#### Scenario: Opt-out from location features
- **WHEN** brother sets privacy to "Hidden"
- **THEN** system removes them from geographic clusters
- **AND** excludes them from proximity-based `/find` searches
- **AND** does not send location-based notifications
- **BUT** preserves all other functionality (attendance, voting, etc.)
