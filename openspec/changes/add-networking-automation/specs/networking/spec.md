# Networking Specification Deltas

## ADDED Requirements

### Requirement: Office Hours Roulette Pairing System
The system SHALL automatically pair brothers monthly for virtual coffee chats to facilitate cross-pollination and relationship building.

#### Scenario: Opt-in to roulette
- **WHEN** a brother executes `/opt-in-roulette`
- **THEN** the system presents preference form with fields:
  - Participation (toggle): Opt in or opt out
  - Matching preference (dropdown): Random, Complementary Industry, Similar Industry
  - Preferred meeting days (multi-select): Weekdays, Weekends, No preference
- **AND** saves preferences in `roulette_preferences` table

#### Scenario: Monthly pairing execution
- **WHEN** the first Monday of the month at 9am arrives
- **THEN** the system queries all opted-in brothers
- **AND** applies pairing algorithm based on preferences:
  - Random: pairs randomly without regard to attributes
  - Complementary: pairs brothers from different industries
  - Similar: pairs brothers from same/related industries
- **AND** creates pairing records in `coffee_pairings` table with status 'pending'
- **AND** ensures each brother paired exactly once per month

#### Scenario: Pairing notification
- **WHEN** monthly pairings are created
- **THEN** the system sends DM to both brothers in each pair:
  - "☕ Office Hours Roulette: You've been paired with @Brother!"
  - Brother's industry, job title, location, timezone
  - LinkedIn profile link (if available)
  - 3 conversation starter suggestions based on shared interests/industries
  - Instructions: "Coordinate a 15min virtual coffee before month end. Mark complete with /coffee-complete"
- **AND** includes calendar scheduling helper link (optional integration)

#### Scenario: Mark coffee chat complete
- **WHEN** a brother executes `/coffee-complete`
- **THEN** the system shows their current month pairing
- **AND** presents confirmation button
- **IF** confirmed, updates `coffee_pairings` status to 'completed' with timestamp
- **AND** awards progress toward "Connector" achievement
- **AND** sends thank you DM: "Thanks for connecting! Your next pairing: [Next Month Date]"

#### Scenario: Pairing completion reminder
- **WHEN** 15 days have passed since pairing creation
- **AND** pairing status is still 'pending'
- **THEN** the system sends gentle reminder DM to both brothers
- **AND** includes rescheduling encouragement: "Busy month? A quick 15min chat over lunch works great!"

#### Scenario: Monthly completion report
- **WHEN** the last day of the month arrives at 5pm
- **THEN** the system calculates completion rate (completed / total pairings)
- **AND** posts summary to `#officer-chat`: "Office Hours Roulette: X% completion rate this month (Y of Z pairs connected)"
- **AND** identifies pairs that didn't connect for E-Board awareness

### Requirement: Geographic Clustering for Local Meetups
The system SHALL leverage existing location data to facilitate in-person networking among geographically proximate brothers.

#### Scenario: Proximity detection
- **WHEN** user profiles are loaded with zip code data
- **THEN** the system calculates distances between all brothers using zip centroids
- **AND** identifies clusters where 3+ brothers are within 50-mile radius
- **AND** records clusters in `geographic_clusters` table with region name (e.g., "NYC Metro", "Bay Area")

#### Scenario: Proximity notification
- **WHEN** a new cluster is detected (3+ brothers in proximity)
- **THEN** the system DMs all brothers in that cluster:
  - "📍 Local Bros Alert: X brothers in your area!"
  - List of nearby brothers with cities and distances
  - Suggestion: "Plan a happy hour or coffee meetup?"
  - Link to create event in `#[region]-meetups` channel (if exists)
- **AND** throttles notifications (max once per month per cluster)

#### Scenario: Find nearby brothers
- **WHEN** a brother executes `/meetup suggest`
- **THEN** the system shows all brothers within 50-mile radius
- **AND** sorts by distance (closest first)
- **AND** includes name, industry, city, distance from user
- **AND** provides "Suggest Meetup" button to initiate group DM

#### Scenario: Regional meetup channels
- **WHEN** a geographic cluster reaches 5+ brothers
- **THEN** the system suggests creating dedicated channel (requires E-Board approval)
- **IF** approved, adds channel to serverConfig (e.g., `#northeast-meetups`)
- **AND** auto-adds all brothers in that cluster to channel
- **AND** posts welcome message with local networking tips

### Requirement: Enhanced /find with Proximity
The system SHALL extend existing `/find` command to support location-based searches.

#### Scenario: Search with location radius
- **WHEN** a brother executes `/find location:Boston radius:25mi`
- **THEN** the system queries brothers within 25-mile radius of Boston zip centroid
- **AND** returns results sorted by distance
- **AND** includes distance in results display: "15 miles away"

#### Scenario: Search with multiple filters including location
- **WHEN** a brother executes `/find industry:Tech location:NYC radius:50mi`
- **THEN** the system combines filters (AND logic)
- **AND** returns brothers matching both industry AND location criteria
- **AND** displays distance and industry in results

#### Scenario: Request coffee chat from search
- **WHEN** brother views `/find` results
- **THEN** each result includes "Request Chat" button
- **IF** clicked, creates connection request in ConnectionsRepository
- **AND** sends DM to target brother: "@Requester would like to connect for coffee - Accept?"
- **IF** accepted, both brothers receive contact info and scheduling instructions
