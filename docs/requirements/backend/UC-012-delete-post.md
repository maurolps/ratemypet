# Delete Post - Requirements

## Functional Requirements

- [x] The system must allow only authenticated users to delete a post.
- [x] The system must require a valid and existing `postId`.
- [x] The system must allow only the **post author** to delete the post.
- [x] The system must implement **soft delete** by updating `Post.tatus` from `PUBLISHED` to `DELETED`
- [x] The system must **not** delete or mutate related data in this use case (no immediate changes to `likes`, `comments`, `pet`, or media).
- [x] Happy Path: The system must return **204 No Content** when the post is successfully deleted.

## Non-Functional Requirements

- [x] The system must enforce database integrity (foreign keys and constraints remain valid after soft delete).
- [x] The system must be resilient to duplicate submissions (idempotent behavior).
- [x] The system must implement the status update safely under concurrent requests (avoid inconsistent final state; multiple deletes should converge to `DELETED`).
- [x] The system must guarantee that read queries used by feed/list endpoints filter posts by `status = PUBLISHED`.
- [x] The system must implement rate limiting to prevent abuse on the delete feature.

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).

## Error Handling

- [x] Returns **400** when required parameters are missing.
- [x] Returns **400** when parameters have invalid types.
- [x] Returns **401** when the user is not authenticated.
- [x] Returns **403** when the authenticated user is not the post author.
- [x] Returns **404** when the post does not exist.
- [x] Returns **500** for unexpected system failures.