# Create Comment - Requirements

## Functional Requirements

- [x] The system must allow only authenticated users to create a comment
- [x] The system must require a valid and existing `postId`
- [x] The system must accept the comment `content` in the request body
- [x] The system must reject blank comments (`content` must be non-empty after trim)
- [x] The system must enforce `content` max length of **500** characters
- [x] The system must allow users to comment on their own posts
- [x] The system must be idempotent
- [x] The system must have a moderation policy
- [x] The system must persist a comment record in the database when it does not already exist
- [x] The system must associate the comment with the `postId` and the authenticated `userId` (author)
- [x] The system must not increment `Post.comments_count` when the request is a replay of an existing idempotency key
- [x] Happy Path: The system must return **200** with the created comment

## Non-Functional Requirements

- [x] The system must enforce database integrity through foreign keys and constraints
- [x] The system must be resilient to duplicate submissions using `Idempotency-Key` (UUID)
- [x] The system must handle concurrent comment requests gracefully (race conditions)
- [x] The system must enforce a unique constraint for `(post_id, author_id, idempotency_key)`
- [x] The system should execute comment creation atomically (Unit of Work)
- [x] The system must guarantee consistency between the `comments` table and `Post.comments_count` under concurrency
- [x] The system must implement rate limiting to prevent abuse on the comment feature
- [x] The moderation policy must be deterministic and testable

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [x] E2E test must include idempotency and concurrency scenarios

## Error Handling

- [x] Returns **400** when required parameters are missing (`postId`, `content`, `Idempotency-Key`)
- [x] Returns **400** when parameters have invalid types or formats (including non-UUID `Idempotency-Key`)
- [x] Returns **400** when the same `Idempotency-Key` is reused with a different payload (different `content`) for the same `(postId, userId)`
- [x] Returns **401** when the user is not authenticated
- [x] Returns **404** when the post does not exist
- [x] Returns **422** when the comment is blocked by moderation (offensive content)
- [x] Returns **500** for unexpected system failures.
