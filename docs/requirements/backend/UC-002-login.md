# Login - Requirements

## Functional Requirements

- [x] The following fields are required: email and password
- [x] The system must normalize email to lowercase
- [x] The system must validate the user credentials
- [x] The system must issue a JWT access and refresh tokens
- [x] The system must persist the refresh token data
- [x] The system must set the refresh token in http cookie
- [x] The system must return HTTP 200 with tokens and user
 
## Non-Functional Requirements

- [x] The system should not reveal whether email or password was incorrect
- [x] The system should support rate-limit feature
- [x] The refresh token should have TTL of 30 days
- [x] The refresh token should be hashed before persisted
- [x] The system should issue a raw refresh token
- [x] The system should issue a JWT access token short-lived (max 15min)
  
## Error Handling

  - [x] 400 Bad Request  - when payload is malformed
  - [x] 401 Unauthorized - for invalid credentials
  - [x] 429 Too Many Requests - when rate limit is exceeded
  - [x] 500 Internal Server Error - on unexpected errors