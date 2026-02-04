# Unlike Post - Requirements

## Functional Requirements

- [ ] The system must allow only authenticated users to unlike a post.
- [ ] The system must require a valid and existing `postId`.
- [ ] The system must allow users to unlike their own posts
- [ ] The system must remove the like only if it exists for the pair `(postId, userId)`.
- [ ] The system must perform a **hard delete** of the like record when it exists.
- [ ] The system must update `Post.likes_count` only through the `Post` Aggregate Root.
- [ ] The system must decrement `Post.likes_count` **only when** a like record is actually removed.
- [ ] The system must not decrement `Post.likes_count` when the post is not liked by the user (idempotent no-op).
- [ ] The system must enforce that `Post.likes_count` never becomes negative (domain rule in Post Aggregate Root).
- [ ] Happy Path: The system must return **200** with `{ postId, likes_count }`.

## Non-Functional Requirements

- [ ] The system must enforce database integrity through foreign keys and constraints.
- [ ] The system must be resilient to duplicate submissions (**idempotent** unlike).
- [ ] The system must handle concurrent unlike requests gracefully (race conditions).
- [ ] The system must execute unlike atomically (delete like + decrement counter in a single transaction / Unit of Work).
- [ ] The system must guarantee consistency between the `likes` table and `Post.likes_count` under concurrency.
- [ ] The system must implement rate limiting to prevent abuse on the unlike feature.

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).

## Error Handling

- [ ] Returns **400** when required parameters are missing (e.g. `postId`).
- [ ] Returns **400** when parameters have invalid types/format (invalid `postId`).
- [ ] Returns **401** when the user is not authenticated.
- [ ] Returns **404** when the post does not exist.
- [ ] Returns **500** for unexpected system failures.