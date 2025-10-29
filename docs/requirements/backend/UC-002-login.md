# Login - Requirements

## Functional Requirements

- [ ] The following fields are required: email and password
- [ ] The name must be normalized and sanitized
- [ ] The system must normalize email to lowercase
- [ ] The system must validate the user credentials
- [ ] The system must issue a JWT refresh token
- [ ] The system must persist the refresh token data
- [ ] The system must set the refresh token in http cookie
- [ ] The system must return HTTP 200 with the access token and user id and email
 
## Non-Functional Requirements

- [ ] The system should not reveal whether email or password was incorrect
- [ ] The system should support rate-limit feature
- [ ] The refresh token should have TTL of 30 days
- [ ] The system should issue a JWT access token short-lived (max 15min)
  
## Error Handling

  - [ ] 400 when payload is malformed
  - [ ] 401 for invalid credentials
  - [ ] 429 when rate limit is exceeded
  - [ ] 500 on unexpected errors