# Delete Pet - Requirements

## Functional Requirements

- [x] The system must allow only authenticated users to delete a pet.
- [x] The system must require a valid and existing `petId`.
- [x] The system must allow pet deletion only when the authenticated user is the **pet owner**.
- [x] The system must implement **soft delete** by setting `deleted_at` 
- [x] The system must cascade the pet deletion by updating **all related posts** (`posts.pet_id = petId`) from `Post.status = PUBLISHED` to `Post.status = DELETED`.
- [x] The system must update `Post.status` only through the `Post` Aggregate Root.
- [x] The system must **not** delete or mutate related data (no immediate changes to `likes`, `comments`, or media) in this use case.
- [x] Happy Path: The system must return **204 No Content** when the pet is successfully deleted (including idempotent re-delete).

## Non-Functional Requirements

- [x] The system must enforce database integrity through foreign keys and constraints.
- [x] The system must be resilient to duplicate submissions (idempotent behavior).
- [x] The system must execute `Pet.deleted_at` update and the cascade update of related posts **atomically** (Unit of Work / transaction).
- [x] The system must implement rate limiting to prevent abuse on the delete pet feature.

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure).

## Error Handling

- [x] Returns **400** when required parameters are missing.
- [x] Returns **400** when parameters have invalid types.
- [x] Returns **401** when the user is not authenticated.
- [x] Returns **403** when the authenticated user is not the pet owner.
- [x] Returns **404** when the pet does not exist.
- [x] Returns **500** for unexpected system failures.