## ADDED Requirements
### Requirement: Automated Audit Scheduling
The system MUST support running the server audit on a predefined schedule.

#### Scenario: Weekly Audit Execution
- **WHEN** the scheduled time (e.g., Monday 9 AM) is reached
- **THEN** the system executes the audit and posts the report to the configured administrative channel.

### Requirement: Centralized Audit Logic
The audit logic MUST be callable both via manual command and automated scheduler.

#### Scenario: Logic Reuse
- **WHEN** either the `/audit` command or the scheduler is triggered
- **THEN** the same validation logic and report generation process are used.
