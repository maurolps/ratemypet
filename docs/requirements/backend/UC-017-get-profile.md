## Get Profile - Requirements

## Functional Requirements

- [x] The system must allow any user (authenticated or not) to fetch a public user profile by `userId`
- [x] The system must require a valid and existing `userId`
- [x] The system must return public user information (`id`, `displayName`, `bio`, `createdAt` and `picture`)
- [x] The system must return aggregated user stats (`postsCount`, `likesReceived`)
- [x] The system must return the list of user pets (non-paginated)
- [x] The system must return pets in a summarized format (`id`, `name`, `type`, `imageUrl`)
- [x] The system must not return sensitive data such as `email`, `password`, or internal flags
- [x] The system must ignore authentication token if provided (public endpoint)
- [x] Happy Path: The system must return **200** with public profile data, stats, and pets

## Non-Functional Requirements

- [x] The system must avoid N+1 queries when resolving pets
- [x] The system must compute stats efficiently (using aggregation queries)
- [x] The system must implement rate limiting to prevent abuse on profile endpoint

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)

## Error Handling

- [x] Returns **400** when `userId` is missing or invalid
- [x] Returns **404** when the user does not exist
- [x] Returns **500** for unexpected system failures