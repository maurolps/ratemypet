# Delete Pet - Requirements

## Functional Requirements

- [ ] The system must allow only authenticated users to delete a pet.
- [ ] The system must require a valid and existing `petId`.
- [ ] The system must allow pet deletion only when the authenticated user is the **pet owner**.
- [ ] The system must implement **soft delete** by setting `deleted_at` 
- [ ] The system must guarantee that a **Post cannot exist without a Pet**.
- [ ] The system must cascade the pet deletion by updating **all related posts** (`posts.pet_id = petId`) from `Post.status = PUBLISHED` to `Post.status = DELETED`.
- [ ] The system must update `Post.status` only through the `Post` Aggregate Root.
- [ ] The system must **not** delete or mutate related data (no immediate changes to `likes`, `comments`, or media) in this use case.
- [ ] Happy Path: The system must return **204 No Content** when the pet is successfully deleted (including idempotent re-delete).

## Non-Functional Requirements

- [ ] The system must enforce database integrity through foreign keys and constraints.
- [ ] The system must be resilient to duplicate submissions (idempotent behavior).
- [ ] The system must execute `Pet.deleted_at` update and the cascade update of related posts **atomically** (Unit of Work / transaction).
- [ ] The system must implement rate limiting to prevent abuse on the delete pet feature.

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).

## Error Handling

- [ ] Returns **400** when required parameters are missing.
- [ ] Returns **400** when parameters have invalid types.
- [ ] Returns **401** when the user is not authenticated.
- [ ] Returns **403** when the authenticated user is not the pet owner.
- [ ] Returns **404** when the pet does not exist.
- [ ] Returns **500** for unexpected system failures.