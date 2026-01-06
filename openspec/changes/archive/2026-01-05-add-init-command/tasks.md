# Tasks: Add Consolidated Server Initialization Command

## Status: IMPLEMENTED

All tasks below have been completed. This proposal documents existing implementation.

## 1. Command Consolidation
- [x] 1.1 Create `/init` slash command with chapter/industry autocomplete
- [x] 1.2 Delete `/setup` command file
- [x] 1.3 Delete `/bootstrap` command file
- [x] 1.4 Add `user` option for registering other founding brothers

## 2. Infrastructure Setup Integration
- [x] 2.1 Call `runSetup()` to create Golden State
- [x] 2.2 Re-fetch channels after setup (they may have just been created)
- [x] 2.3 Post Rules embed to #rules-and-conduct
- [x] 2.4 Post Verification Gate to #welcome-gate
- [x] 2.5 Log all actions for debugging

## 3. Channel Permission Overwrites
- [x] 3.1 Add `PermissionOverwrite` interface to serverRequirements.ts
- [x] 3.2 Configure #welcome-gate permissions (visible only to ✅ Rules Accepted)
- [x] 3.3 Configure #verification-requests permissions (visible to E-Board and Brothers)
- [x] 3.4 Update setupHandler to apply permission overwrites

## 4. Founding Brother Registration
- [x] 4.1 Create "Light the Torch" button flow
- [x] 4.2 Implement Modal 1: Identity (First, Last, Don Name, Year/Semester, Job Title)
- [x] 4.3 Implement "Continue to Step 2" button bridge
- [x] 4.4 Implement Modal 2: Contact (Phone, City)
- [x] 4.5 Create user record with BROTHER status
- [x] 4.6 Assign 🦁 ΓΠ Brother role
- [x] 4.7 Add pendingInitRegistrations and pendingInitModal1Data maps

## 5. Validation & Guards
- [x] 5.1 Server owner check (guild.ownerId)
- [x] 5.2 Bootstrap threshold check (disabled at 2+ brothers)
- [x] 5.3 Chapter validation against CHAPTERS constant
- [x] 5.4 Industry validation against INDUSTRIES constant
- [x] 5.5 Year/semester format validation
- [x] 5.6 Don Name required validation

## 6. Testing
- [x] 6.1 Test as non-owner (should reject)
- [x] 6.2 Test on fresh server (should create all infrastructure)
- [x] 6.3 Test embed posting (should post to correct channels)
- [x] 6.4 Test founding brother registration
- [x] 6.5 Test registering another user as founding brother
- [x] 6.6 Test threshold lockout (should reject after 2 brothers)
