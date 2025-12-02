# Refresh Token - Requirements

## Functional Requirements

- [x] The system must read the refresh token from an HTTP-only cookie
- [x] The system must validate the refresh token format
- [x] The system must support rotation of refresh tokens
- [x] The system must check if the refresh token is revoked or expired
- [x] The system must use rate limiting
- [x] On successful validation, the system must generate a new access token
- [x] On successful validation, the system must generate a new refresh token in the format id.secret
- [x] The system must generate a secret using a cryptograph secure random value
- [x] The system must persist only a hashed version of the secret part of the refresh token
- [x] On successful refresh, return the new access token in the response body
- [x] On successful refresh, set the new refresh token (raw secret) in an HTTP-only cookie

## Non-Functional Requirements

- [x] The access token (JWT) must expire in at most 15 minutes (production)
- [x] The refresh token must expire in at most 30 days (production)
- [x] No sensitive data (passwords, raw refresh tokens, secrets) must be included in the JWT payload
- [x] No sensitive data (passwords, raw refresh tokens, secrets) must be written to logs
- [x] The system must use secure random generation for refresh token secrets
- [x] Configuration values related to token lifetimes must be easily adjustable

## Error Handling

- [x] Returns **400** when the refresh token value is malformed
- [x] Returns **401** when the refresh token is revoked, expired or invalid
- [x] Returns **429** when the request is blocked by rate limiting
- [x] Returns **500** when an unexpected server error occurs