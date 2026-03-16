# Google Authentication (OIDC) - Requirements

## Functional Requirements

- [x] The system must allow users to authenticate using their Google account via OpenID Connect (OIDC).
- [x] The system must require a valid `id_token` in the request body
- [x] The system must expose the endpoint `POST /auth/google`    
- [x] The system must validate the `id_token` using oficial `google-auth-library`
- [x] The system must extract the following identity information from the validated token:
  - `provider_user_id (sub)`
  - `provider` (fixed value "google")
  - `email`
  - `name`
  - `picture` (optional in the database)
- [x] The system must create a new user if no user exists with the provided `provider_user_id`
- [x] If a user exists, the system must authenticate the user.
- [x] The system must allow multiple users with the same email if they belong to different providers.
- [x] The system must issue a JWT access and refresh tokens    
- [x] The system must persist the refresh token using rotation strategy
- [x] The system must set the refresh token in an HTTP-only cookie in the format <id.secret> (raw secret)   
- [x] Happy Path: The system must return **200** with `access_token`, user data and cookie set.

## Non-Functional Requirements

- [x] The system must validate `id_token` signature, issuer, audience, and expiration    
- [x] The system must require email_verified = true
- [x] The system must enforce uniqueness constraints on (`provider`, `provider_user_id`) in the database
- [x] email SHOULD not be used for identity lookup
- [x] The system must hash refresh tokens before persisting them
- [x] The system must prevent reuse of refresh tokens (rotation required)  
- [x] No sensitive data (passwords, raw refresh tokens, secrets) must be included in the JWT payload or logs
- [x] The system must use secure random generation for refresh token secrets
- [x] Configuration values related to token lifetimes must be easily adjustable
- [x] The system should implement rate limiting on `POST /auth/google`    

---

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)

---

## Error Handling

- [x] Returns **400** when required parameters are missing/invalid       
- [x] Returns **401** when `id_token` validation fails (invalid signature, issuer, audience, or expired token)
- [x] Returns **429** when rate limit is exceeded
- [x] Returns **500** for unexpected system failures
