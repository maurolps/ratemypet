# Get Feed - Requirements

## Functional Requirements

- [x] The system must allow any user to fetch the global feed
- [x] The system must support optional authentication for enrichment only
- [x] The system must expose a public endpoint `GET /feed`
- [x] The system must return only `PUBLISHED` posts
- [x] The system must return feed items ordered by most recent first
- [x] The system must return a paginated list of posts
- [x] The system must support cursor-based pagination with the following rules:
  - Stable order: `created_at desc, id desc`
  - Default `limit` is **20**
  - Max `limit` is **50**
  - Cursor must be an opaque string encoding (`created_at`, `id`)
- [x] The system must return post items with author and pet names
- [x] The system must return `viewer_has_liked` for each post
- [x] The system must set `viewer_has_liked` to `false` when unauthenticated
- [x] The system must compute `viewer_has_liked` when a valid token is provided
- [x] Happy Path: The system must return **200** with `items`, `has_more`, and `next_cursor`

## Non-Functional Requirements

- [x] The system must enforce database integrity through foreign keys and constraints
- [x] The system must ensure stable ordering for pagination with Tie-breaker
- [x] The system must use seek pagination (cursor-based)
- [x] The system must avoid N+1 queries when resolving `author_name` and `pet_name`
- [x] The system must support fast lookup for `viewer_has_liked`
- [x] The system should implement rate limiting

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [x] E2E tests must cover cursor pagination scenarios

## Error Handling

- [x] Returns **400** when parameters are invalid:
  - invalid `limit` (not a number / out of bounds)
  - invalid `cursor` (malformed / cannot be decoded)
- [x] Returns **401** when token is invalid (if provided)
- [x] Returns **500** for unexpected system failures