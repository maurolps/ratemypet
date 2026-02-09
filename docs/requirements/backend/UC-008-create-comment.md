# Create Comment - Requirements

## Functional Requirements

- [ ] The system must allow only authenticated users to create a comment
- [ ] The system must require a valid and existing `postId`
- [ ] The system must accept the comment `content` in the request body
- [ ] The system must reject blank comments (`content` must be non-empty after trim)
- [ ] The system must enforce `content` max length of **500** characters
- [ ] The system must allow users to comment on their own posts
- [ ] The system must be idempotent
- [ ] The system must have a moderation policy
- [ ] The system must persist a comment record in the database when it does not already exist
- [ ] The system must associate the comment with the `postId` and the authenticated `userId` (author)
- [ ] The system must not increment `Post.comments_count` when the request is a replay of an existing idempotency key
- [ ] Happy Path: The system must return **200** with the created comment

## Non-Functional Requirements

- [ ] The system must enforce database integrity through foreign keys and constraints
- [ ] The system must be resilient to duplicate submissions using `Idempotency-Key` (UUID)
- [ ] The system must handle concurrent comment requests gracefully (race conditions)
- [ ] The system must enforce a unique constraint for `(post_id, author_id, idempotency_key)`
- [ ] The system should execute comment creation atomically (Unit of Work)
- [ ] The system must guarantee consistency between the `comments` table and `Post.comments_count` under concurrency
- [ ] The system must implement rate limiting to prevent abuse on the comment feature
- [ ] The moderation policy must be deterministic and testable

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [ ] E2E test must include idempotency and concurrency scenarios

## Error Handling

- [ ] Returns **400** when required parameters are missing (`postId`, `content`, `Idempotency-Key`)
- [ ] Returns **400** when parameters have invalid types or formats (including non-UUID `Idempotency-Key`)
- [ ] Returns **401** when the user is not authenticated
- [ ] Returns **404** when the post does not exist
- [ ] Returns **409** when the same `Idempotency-Key` is reused with a different payload (different `content`) for the same `(postId, userId)`
- [ ] Returns **422** when the comment is blocked by moderation (offensive content)
- [ ] Returns **500** for unexpected system failures.
