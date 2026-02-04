# Like Post - Requirements

## Functional Requirements

- [x] The system must allow only authenticated users to like a post.
- [x] The system must require a valid and existing `postId`.
- [x] The system must allow users to like their own posts only once.
- [x] The system must prevent duplicate likes from the same user on the same post.
- [x] The system must persist a like record in the database when it does not already exist.
- [x] The system must associate the like with the post id.
- [x] The system must update `Post.likes_count` only through the `Post` Aggregate Root.
- [x] The system must not increment the post `like_count` when the post is already liked by the user.
- [x] Happy Path: The system must return **200** with the `postId`, `likeId` and updated `likes_count`.


## Non-Functional Requirements

- [x] The system must enforce database integrity through foreign keys and constraints.
- [x] The system must be resilient to duplicate submissions (idempotent).
- [x] The system must handle concurrent like requests gracefully. (race conditions)
- [x] The system must enforce a unique constraint for `(post_id, user_id)`.
- [x] The system should execute like creation atomically.
- [x] The system must be compatible with future unlike workflows.
- [x] The system must guarantee consistency between the `likes` table and `Post.likes_count` under concurrency
- [x] The system must implement rate limiting to prevent abuse on the like feature.

## TDD
- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).

## Error Handling

- [x] Returns **400** when required parameters are missing.
- [x] Returns **400** when parameters have invalid types.
- [x] Returns **401** when the user is not authenticated.
- [x] Returns **404** when the post does not exist.
- [x] Returns **500** for unexpected system failures.
