# Google Authentication (OIDC) - Requirements

## Functional Requirements

- [ ] The system must allow users to authenticate using their Google account via OpenID Connect (OIDC).
- [ ] The system must require a valid `id_token` in the request body
- [ ] The system must expose the endpoint `POST /auth/google`    
- [ ] The system must validate the `id_token` using oficial `google-auth-library`
- [ ] The system must extract the following identity information from the validated token:
  - `provider_user_id (sub)`
  - `provider` (fixed value "google")
  - `email`
  - `name`
  - `picture` (optional in the database)
- [ ] The system must create a new user if no user exists with the provided `provider_user_id`
- [ ] If a user exists, the system must authenticate the user.
- [ ] The system must allow multiple users with the same email if they belong to different providers.
- [ ] The system must issue a JWT access and refresh tokens    
- [ ] The system must persist the refresh token using rotation strategy
- [ ] The system must set the refresh token in an HTTP-only cookie in the format <id.secret> (raw secret)   
- [ ] Happy Path: The system must return **200** with `access_token`, user data and cookie set.

## Non-Functional Requirements

- [ ] The system must validate `id_token` signature, issuer, audience, and expiration    
- [ ] The system must require email_verified = true
- [ ] The system must enforce uniqueness constraints on (`provider`, `provider_user_id`) in the database
- [ ] email SHOULD not be used for identity lookup
- [ ] The system must hash refresh tokens before persisting them
- [ ] The system must prevent reuse of refresh tokens (rotation required)  
- [ ] No sensitive data (passwords, raw refresh tokens, secrets) must be included in the JWT payload or logs
- [ ] The system must use secure random generation for refresh token secrets
- [ ] Configuration values related to token lifetimes must be easily adjustable
- [ ] The system should implement rate limiting on `POST /auth/google`    

---

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)    
- [ ] E2E tests must cover successful authentication and refresh token rotation scenarios    

---

## Error Handling

- [ ] Returns **400** when required parameters are missing/invalid       
- [ ] Returns **401** when `id_token` validation fails (invalid signature, issuer, audience, or expired token)
- [ ] Returns **429** when rate limit is exceeded
- [ ] Returns **500** for unexpected system failures
