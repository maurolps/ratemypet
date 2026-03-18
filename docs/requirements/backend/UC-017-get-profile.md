## Get Profile - Requirements

## Functional Requirements

- [ ] The system must allow any user (authenticated or not) to fetch a public user profile by `userId`
- [ ] The system must require a valid and existing `userId`
- [ ] The system must return public user information (`id`, `displayName`, `bio`)
- [ ] The system must return aggregated user stats (`postsCount`, `likesReceived`)
- [ ] The system must return the list of user pets (non-paginated)
- [ ] The system must return pets in a summarized format (`id`, `name`, `type`, `photoUrl`)
- [ ] The system must not return sensitive data such as `email`, `password`, or internal flags
- [ ] The system must ignore authentication token if provided (public endpoint)
- [ ] Happy Path: The system must return **200** with public profile data, stats, and pets

## Non-Functional Requirements

- [ ] The system must avoid N+1 queries when resolving pets
- [ ] The system must compute stats efficiently (using aggregation queries)
- [ ] The system must implement rate limiting to prevent abuse on profile endpoint

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)

## Error Handling

- [ ] Returns **400** when `userId` is missing or invalid
- [ ] Returns **404** when the user does not exist
- [ ] Returns **500** for unexpected system failures