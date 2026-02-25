## Functional Requirements

- [ ] The system must allow only authenticated users to delete a post.
- [ ] The system must require a valid and existing `postId`.
- [ ] The system must allow only the **post author** to delete the post.
- [ ] The system must implement **soft delete** by updating `Post.tatus` from `PUBLISHED` to `DELETED`
- [ ] The system must **not** delete or mutate related data in this use case (no immediate changes to `likes`, `comments`, `pet`, or media).
- [ ] Happy Path: The system must return **204 No Content** when the post is successfully deleted.

## Non-Functional Requirements

- [ ] The system must enforce database integrity (foreign keys and constraints remain valid after soft delete).
- [ ] The system must be resilient to duplicate submissions (idempotent behavior).
- [ ] The system must implement the status update safely under concurrent requests (avoid inconsistent final state; multiple deletes should converge to `DELETED`).
- [ ] The system must guarantee that read queries used by feed/list endpoints filter posts by `status = PUBLISHED`.
- [ ] The system must implement rate limiting to prevent abuse on the delete feature.
---

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).
---

## Error Handling

- [ ] Returns **400** when required parameters are missing.
- [ ] Returns **400** when parameters have invalid types.
- [ ] Returns **401** when the user is not authenticated.
- [ ] Returns **401** when the authenticated user is not the post author.
- [ ] Returns **404** when the post does not exist.
- [ ] Returns **500** for unexpected system failures.