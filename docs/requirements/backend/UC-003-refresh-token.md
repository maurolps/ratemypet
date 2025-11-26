# Refresh Token - Requirements

## Functional Requirements

- [ ] The system must read the refresh token from an HTTP-only cookie
- [ ] The system must validate the refresh token format
- [ ] The system must support rotation of refresh tokens
- [ ] The system must check if the refresh token is revoked or expired
- [ ] The system must use rate limiting
- [ ] On successful validation, the system must generate a new access token
- [ ] On successful validation, the system must generate a new refresh token in the format id.secret
- [ ] The system must generate a secret using a cryptograph secure random value
- [ ] The system must persist only a hashed version of the secret part of the refresh token
- [ ] On successful refresh, return the new access token in the response body
- [ ] On successful refresh, set the new refresh token (raw secret) in an HTTP-only cookie

## Non-Functional Requirements

- [ ] The access token (JWT) must expire in at most 15 minutes (production)
- [ ] The refresh token must expire in at most 30 days (production)
- [ ] No sensitive data (passwords, raw refresh tokens, secrets) must be included in the JWT payload
- [ ] No sensitive data (passwords, raw refresh tokens, secrets) must be written to logs
- [ ] The system must use secure random generation for refresh token secrets
- [ ] Configuration values related to token lifetimes must be easily adjustable

## Error Handling

- [ ] Returns **400** when the refresh token value is malformed
- [ ] Returns **401** when the refresh token is revoked, expired or invalid
- [ ] Returns **429** when the request is blocked by rate limiting
- [ ] Returns **500** when an unexpected server error occurs