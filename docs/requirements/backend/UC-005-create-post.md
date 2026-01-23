# Create Post - Requirements

## Functional Requirements

- [x] The system must allow only authenticated users to create a post.
- [x] The system must require the pet to belong to the authenticated user.
- [x] The system must persist the post in the database.
- [x] The system must associate the post with a pet id.
- [x] The system must associate the post with the author id.
- [x] The system must allow the user to provide a custom caption when creating the post.
- [x] The system must use the pet default caption when no custom caption is provided.
- [x] The system must store the final caption inside the post.
- [x] The system must have a moderation process for the custom caption.
- [x] The system must publish the post immediately when the caption is valid.
- [x] The system must return the created post data after successful creation.


## Non-Functional Requirements

- [x] The system must enforce caption length limits (minimum and maximum).
- [x] The system must prevent HTML in captions.
- [ ] The system must ensure post creation is idempotent per request.
  - This requirement was moved and referenced on the refactor backlog
- [x] The system must not depend on AI services during post creation.
- [x] The system must ensure database integrity through foreign keys and constraints.
- [x] The system must be compatible with future moderation workflows.


## Error Handling

- [x] Returns **400** when required parameters are missing.
- [x] Returns **400** when parameters have invalid types.
- [x] Returns **401** when the user is not authenticated.
- [x] Returns **403** when the pet does not belong to the authenticated user.
- [x] Returns **404** when the pet does not exist.
- [x] Returns **422** when the caption moderation fails.
- [x] Returns **500** for unexpected system failures.