# Update Profile - Requirements

## Functional Requirements

- [x] The system must allow an authenticated user to update their profile information
- [x] The system must require a valid authentication token
- [x] The system must resolve the `userId` from the authentication context
- [x] The system must allow updating only the fields:
  - `displayName`
  - `bio`
- [x] The system must allow partial updates (fields are optional)
- [x] The system must validate `displayName` length (min and max constraints)
- [x] The system must validate `bio` length (max constraint)
- [x] The system must persist only the provided fields without overriding unspecified fields
- [x] The system must update the user profile in the database
- [x] Happy Path: The system must return **200** with updated profile data (`id`, `displayName`, `bio`)

##  Non-Functional Requirements

- [x] The system must avoid unnecessary database writes when no changes are detected (optional optimization)
- [x] The system must enforce proper indexing on `users.id`
- [x] The system must implement rate limiting to prevent abuse of profile updates
- [x] The system must sanitize input data to prevent injection or malformed content
- [x] The system must run a profanity checker on `displayName` and `bio` to prevent inappropriate content

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).

## Error Handling

- [x] Returns **400** when authentication token is missing/malformed
- [x] Returns **400** when validation fails (e.g. `displayName` too short/long, `bio` too long)
- [x] Returns **401** when authentication token is invalid/expired
- [x] Returns **404** when the authenticated user no longer exists
- [x] Returns **422** when `displayName` or `bio` contains inappropriate content
- [x] Returns **500** for unexpected system failures