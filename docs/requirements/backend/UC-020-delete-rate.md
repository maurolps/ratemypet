# Delete Rate - Requirements

## Functional Requirements

- [ ] The system must allow only authenticated users to delete their rate from a pet
- [ ] The system must extract the `userId` from the authentication flow
- [ ] The system must require a valid and existing `petId`
- [ ] The system must remove the rate only if it exists for the pair `(userId, petId)`
- [ ] The system must perform a **hard delete** of the rate record when it exists
- [ ] The system must not fail when the user has not rated the pet yet (idempotent no-op)
- [ ] The system must expose the endpoint `DELETE /pets/:id/rate`
- [ ] Happy Path: The system must return **200 OK** with the delete status, e.g.:
  `{ petId: string, "status": "deleted" | "unchanged" }`

## Non-Functional Requirements

- [ ] The system must enforce uniqueness at db level for `(user_id, pet_id)` in the ratings table
- [ ] The system must be idempotent for repeated delete requests
- [ ] The system must handle concurrent deletes safely (no inconsistent results)
- [ ] The system must preserve database integrity through foreign keys and constraints

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)

## Error Handling

- [ ] Returns **400** when `petId` is invalid/missing
- [ ] Returns **401** when authentication token is missing, invalid, or expired
- [ ] Returns **404** when the pet does not exist
- [ ] Returns **500** for unexpected system failures
