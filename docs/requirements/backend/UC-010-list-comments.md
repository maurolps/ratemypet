# List Comments - Requirements

## Functional Requirements

- [x] The system must allow any user to list comments for a post
- [x] The system must ignore authentication entirely
- [x] The system must expose a public endpoint `GET /posts/:id/comments`
- [x] The system must require a valid and existing `postId`
- [x] The system must return comments ordered by most recent first
- [x] The system must return a paginated list of comments
- [x] The system must support cursor-based pagination with the following rules:
  - Stable order: `created_at desc, id desc`
  - Default `limit` is **20**
  - Max `limit` is **50**
  - Cursor must be an opaque string encoding (`created_at`, `id`)
- [x] The system must return comment with author name
- [x] Happy Path: The system must return **200** with `items`, `has_more`, and `next_cursor`

## Non-Functional Requirements

- [x] The system must enforce database integrity through foreign keys and constraints
- [x] The system must ensure stable ordering for pagination with Tie-breaker
- [x] The system must use seek pagination (cursor-based)
- [x] The system must avoid N+1 queries when resolving `author_name`
- [x] The system should implement rate limiting 

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [x] E2E tests must cover cursor pagination

## Error Handling

- [x] Returns **400** when required parameters are missing/invalid:
  - invalid `postId` (not UUID)
  - invalid `limit` (not a number / out of bounds)
  - invalid `cursor` (malformed / cannot be decoded)
- [x] Returns **404** when the post does not exist
- [x] Returns **500** for unexpected system failures



