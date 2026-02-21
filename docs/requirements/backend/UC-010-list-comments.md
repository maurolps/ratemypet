# List Comments - Requirements

## Functional Requirements

- [ ] The system must allow any user to list comments for a post
- [ ] The system must ignore authentication entirely
- [ ] The system must expose a public endpoint `GET /posts/:id/comments`
- [ ] The system must require a valid and existing `postId`
- [ ] The system must return comments ordered by most recent first
- [ ] The system must return a paginated list of comments
- [ ] The system must support cursor-based pagination with the following rules:
  - Stable order: `created_at desc, id desc`
  - Default `limit` is **20**
  - Max `limit` is **50**
  - Cursor must be an opaque string encoding (`created_at`, `id`)
- [ ] The system must return comment with author name
- [ ] Happy Path: The system must return **200** with `items`, `has_more`, and `next_cursor`

## Non-Functional Requirements

- [ ] The system must enforce database integrity through foreign keys and constraints
- [ ] The system must ensure stable ordering for pagination with Tie-breaker
- [ ] The system must use seek pagination (cursor-based)
- [ ] The system must avoid N+1 queries when resolving `author_name`
- [ ] The system should implement rate limiting 

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [ ] E2E tests must cover cursor pagination scenarios:

## Error Handling

- [ ] Returns **400** when required parameters are missing/invalid:
  - invalid `postId` (not UUID)
  - invalid `limit` (not a number / out of bounds)
  - invalid `cursor` (malformed / cannot be decoded)
- [ ] Returns **404** when the post does not exist
- [ ] Returns **500** for unexpected system failures



