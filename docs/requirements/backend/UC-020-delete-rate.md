# Delete Rate - Requirements

## Functional Requirements

- [x] The system must allow only authenticated users to delete their rate from a pet
- [x] The system must extract the `userId` from the authentication flow
- [x] The system must require a valid and existing `petId`
- [x] The system must remove the rate only if it exists for the pair `(userId, petId)`
- [x] The system must perform a **hard delete** of the rate record when it exists
- [x] The system must not fail when the user has not rated the pet yet (idempotent no-op)
- [x] The system must expose the endpoint `DELETE /pets/:id/rate`
- [x] Happy Path: The system must return **200 OK** with the delete status, e.g.:
  `{ petId: string, "status": "deleted" | "unchanged" }`

## Non-Functional Requirements

- [x] The system must enforce uniqueness at db level for `(user_id, pet_id)` in the ratings table
- [x] The system must be idempotent for repeated delete requests
- [x] The system must handle concurrent deletes safely (no inconsistent results)
- [x] The system must preserve database integrity through foreign keys and constraints

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)

## Error Handling

- [x] Returns **400** when `petId` is invalid/missing
- [x] Returns **401** when authentication token is missing, invalid, or expired
- [x] Returns **404** when the pet does not exist
- [x] Returns **500** for unexpected system failures
