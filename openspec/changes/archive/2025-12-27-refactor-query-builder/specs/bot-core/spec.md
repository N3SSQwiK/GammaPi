## MODIFIED Requirements
### Requirement: Secure Database Access
All database interactions MUST use parameterized queries or an ORM-like abstraction to prevent SQL injection.

#### Scenario: Dynamic Filtering
- **WHEN** a query requires dynamic filtering (e.g. by Industry or City)
- **THEN** the query builder MUST NOT use string concatenation for values, but instead use bound parameters.
