# Get Me - Requirements

## Functional Requirements

- [ ] The system must allow an authenticated user to fetch their own profile data
- [ ] The system must require a valid authentication token  
- [ ] The system must return user basic information (`id`, `displayName`, `email`, `bio`)
- [ ] The system must return aggregated user stats (`postsCount`, `likesReceived`)
- [ ] The system must return the list of user pets (non-paginated)
- [ ] The system must return pets in a summarized format (`id`, `name`, `type`, `imageUrl`)
- [ ] The system must not return sensitive data such as `password` or internal flags
- [ ] Happy Path: The system must return **200** with user profile data, stats, and pets

## Non-Functional Requirements

- [ ] The system must avoid N+1 queries when resolving pets
- [ ] The system must compute stats efficiently (using aggregation queries or optimized subqueries)
- [ ] The system must ensure low-latency response for profile loading (optimized for first screen render)
- [ ] The system must enforce proper indexing on `posts.user_id`
- [ ] The system must implement rate limiting to prevent abuse on profile endpoint

## Error Handling

- [ ] Returns **401** when authentication token is missing, invalid, or expired
- [ ] Returns **404** when the authenticated user no longer exists
- [ ] Returns **500** for unexpected system failures