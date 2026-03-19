# Update Profile - Requirements

## Functional Requirements

- [ ] The system must allow an authenticated user to update their profile information
- [ ] The system must require a valid authentication token
- [ ] The system must resolve the `userId` from the authentication context
- [ ] The system must allow updating only the fields:
  - `displayName`
  - `bio`
- [ ] The system must allow partial updates (fields are optional)
- [ ] The system must validate `displayName` length (min and max constraints)
- [ ] The system must validate `bio` length (max constraint)
- [ ] The system must persist only the provided fields without overriding unspecified fields
- [ ] The system must update the user profile in the database
- [ ] Happy Path: The system must return **200** with updated profile data (`id`, `displayName`, `bio`)

##  Non-Functional Requirements

- [ ] The system must avoid unnecessary database writes when no changes are detected (optional optimization)
- [ ] The system must enforce proper indexing on `users.id`
- [ ] The system must implement rate limiting to prevent abuse of profile updates
- [ ] The system must sanitize input data to prevent injection or malformed content
- [ ] The system must run a profanity checker on `displayName` and `bio` to prevent inappropriate content

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).

## Error Handling

- [ ] Returns **400** when authentication token is missing/malformed
- [ ] Returns **400** when validation fails (e.g. `displayName` too short/long, `bio` too long)
- [ ] Returns **401** when authentication token is invalid/expired
- [ ] Returns **404** when the authenticated user no longer exists
- [ ] Returns **422** when `displayName` or `bio` contains inappropriate content
- [ ] Returns **500** for unexpected system failures