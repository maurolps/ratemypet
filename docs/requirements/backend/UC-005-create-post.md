# Create Post - Requirements

## Functional Requirements

- [ ] The system must allow only authenticated users to create a post.
- [ ] The system must require the pet to belong to the authenticated user.
- [ ] The system must persist the post in the database.
- [ ] The system must associate the post with a pet id.
- [ ] The system must associate the post with the author id.
- [ ] The system must allow the user to provide a custom caption when creating the post.
- [ ] The system must use the pet default caption when no custom caption is provided.
- [ ] The system must store the final caption inside the post.
- [ ] The system must have a validation process for the custom caption.
- [ ] The system must publish the post immediately when the caption is valid.
- [ ] The system must return the created post data after successful creation.


## Non-Functional Requirements

- [ ] The system must enforce caption length limits (minimum and maximum).
- [ ] The system must prevent HTML, markup, and URLs in captions.
- [ ] The system must normalize caption input before validation.
- [ ] The system must ensure post creation is idempotent per request.
- [ ] The system must not depend on AI services during post creation.
- [ ] The system must ensure database integrity through foreign keys and constraints.
- [ ] The system must be compatible with future moderation workflows.


## Error Handling

- [ ] Returns **401** when the user is not authenticated.
- [ ] Returns **403** when the pet does not belong to the authenticated user.
- [ ] Returns **404** when the pet does not exist.
- [ ] Returns **422** when the caption validation fails.
- [ ] Returns **500** for unexpected system failures.