# Get Post - Requirements

## Functional Requirements

- [x] The system must allow any user to fetch a post by id
- [x] The system must require a valid and existing `postId`
- [x] The system must return post details and counters
- [x] The system must return `viewer_has_liked` boolean if authenticated
- [x] The system must support optional authentication
- [x] The system must return the 20 most recent comments by default
- [x] The system must support cursor-based pagination for comments (limits: default **20**, max **100**)
- [x] Happy Path: The system must return **200** with post data, recent comments, and pagination metadata

## Non-Functional Requirements

- [x] The system must enforce database integrity through foreign keys and constraints
- [x] The system must ensure stable ordering for comment pagination
- [x] The system must avoid N+1 queries when resolving comment author names.
- [x] The system must support fast lookup for `viewer_has_liked`
- [x] The system must implement rate limiting to prevent abuse on GetPost

## TDD
- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [x] E2E tests must cover pagination scenarios

## Error Handling
- [x] Returns **400** when required parameters are missing/invalid (`postId`, cursor/limit when provided)
- [x] Returns **401** when an `Authorization` header is provided but the token is invalid/expired
- [x] Returns **404** when the post does not exist
- [x] Returns **500** for unexpected system failures
