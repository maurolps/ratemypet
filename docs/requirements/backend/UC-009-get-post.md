# Get Post - Requirements

## Functional Requirements

- [ ] The system must allow any user to fetch a post by id
- [ ] The system must require a valid and existing `postId`
- [ ] The system must return post details and counters
- [ ] The system must return `viewer_has_liked` boolean if authenticated
- [ ] The system must support optional authentication
- [ ] The system must return the 20 most recent comments
- [ ] The system must support cursor-based pagination for comments (limits: default **20**, max **100**)
- [ ] Happy Path: The system must return **200** with post data, recent comments, and pagination metadata

## Non-Functional Requirements

- [ ] The system must enforce database integrity through foreign keys and constraints
- [ ] The system must ensure stable ordering for comment pagination
- [ ] The system must avoid N+1 queries when resolving comment author names.
- [ ] The system must support fast lookup for `viewer_has_liked` (unique constraint / index on likes relation)
- [ ] The system must implement rate limiting to prevent abuse on GetPost

## TDD
- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [ ] E2E tests must cover pagination scenarios

## Error Handling
- [ ] Returns **400** when required parameters are missing/invalid (`postId`, cursor/limit when provided)
- [ ] Returns **401** when an `Authorization` header is provided but the token is invalid/expired
- [ ] Returns **404** when the post does not exist
- [ ] Returns **500** for unexpected system failures
