# Delete Comment - Requirements

## Functional Requirements

- [x] The system must allow only authenticated users to delete a comment.
- [x] The system must require a valid and existing `postId`.
- [x] The system must require a valid `commentId`.
- [x] The system must allow comment deletion only when the authenticated user is either:
  - the **comment author**, or
  - the **post author** (moderation on their own post).
- [x] The system must ensure the `commentId` belongs to the provided `postId`.
- [x] The system must perform a **Hard Delete** of the comment record in the database.
- [x] The system must update `Post.comments_count` only through the `Post` Aggregate Root.
- [x] The system must decrement `Post.comments_count` **only if** the comment was actually deleted.
- [x] Happy Path: The system must return **204 No Content** when the comment is successfully deleted 

## Non-Functional Requirements

- [x] The system must enforce database integrity through foreign keys and constraints.
- [x] The system must be resilient to duplicate submissions (idempotent).
- [x] The system must execute comment deletion and `comments_count` decrement **atomically** (Unit of Work / transaction).
- [x] The system must guarantee consistency between the `comments` table and `Post.comments_count` under concurrency.
- [x] The system must implement rate limiting to prevent abuse on the delete comment feature.

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).

## Error Handling

- [x] Returns **400** when required parameters are missing.
- [x] Returns **400** when parameters have invalid types.
- [x] Returns **401** when the user is not authenticated.
- [x] Returns **403** when the authenticated user is neither the comment author nor the post author.
- [x] Returns **404** when the post does not exist.
- [x] Returns **500** for unexpected system failures.