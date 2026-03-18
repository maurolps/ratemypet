# Get Me - Requirements

## Functional Requirements

- [x] The system must allow an authenticated user to fetch their own profile data
- [x] The system must require a valid authentication token  
- [x] The system must return user basic information (`id`, `displayName`, `email`, `bio`)
- [x] The system must return aggregated user stats (`postsCount`, `likesReceived`)
- [x] The system must return the list of user pets (non-paginated)
- [x] The system must return pets in a summarized format (`id`, `name`, `type`, `imageUrl`)
- [x] Happy Path: The system must return **200** with user profile data, stats, and pets

## Non-Functional Requirements

- [x] The system must avoid N+1 queries when resolving pets
- [x] The system must compute stats efficiently (using aggregation queries)
- [x] The system must enforce proper indexing on `posts.user_id`
- [x] The system must implement rate limiting to prevent abuse on profile endpoint

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).
- [x] At least one E2E Test covering happy path

## Error Handling

- [x] Returns **400** when authentication token is missing/malformed
- [x] Returns **401** when authentication token is invalid/expired
- [x] Returns **404** when the authenticated user no longer exists
- [x] Returns **500** for unexpected system failures