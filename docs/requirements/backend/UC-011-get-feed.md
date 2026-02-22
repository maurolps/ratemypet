# Get Feed - Requirements

## Functional Requirements

- [ ] The system must allow any user to fetch the global feed
- [ ] The system must support optional authentication for enrichment only
- [ ] The system must expose a public endpoint `GET /feed`
- [ ] The system must return only `PUBLISHED` posts
- [ ] The system must return feed items ordered by most recent first
- [ ] The system must return a paginated list of posts
- [ ] The system must support cursor-based pagination with the following rules:
  - Stable order: `created_at desc, id desc`
  - Default `limit` is **20**
  - Max `limit` is **50**
  - Cursor must be an opaque string encoding (`created_at`, `id`)
- [ ] The system must return post items with author and pet names
- [ ] The system must return `viewer_has_liked` for each post
- [ ] The system must set `viewer_has_liked` to `false` when unauthenticated
- [ ] The system must compute `viewer_has_liked` when a valid token is provided
- [ ] The system must ignore authentication when the token is missing/invalid/expired
- [ ] Happy Path: The system must return **200** with `items`, `has_more`, and `next_cursor`

## Non-Functional Requirements

- [ ] The system must enforce database integrity through foreign keys and constraints
- [ ] The system must ensure stable ordering for pagination with Tie-breaker
- [ ] The system must use seek pagination (cursor-based)
- [ ] The system must avoid N+1 queries when resolving `author_name` and `pet_name`
- [ ] The system must support fast lookup for `viewer_has_liked`
- [ ] The system should implement rate limiting

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [ ] E2E tests must cover cursor pagination scenarios:

## Error Handling

- [ ] Returns **400** when parameters are invalid:
  - invalid `limit` (not a number / out of bounds)
  - invalid `cursor` (malformed / cannot be decoded)
- [ ] Returns **500** for unexpected system failures