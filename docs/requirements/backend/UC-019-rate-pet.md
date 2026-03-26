# Rate Pet - Requirements

## Functional Requirements

- [x] The system must allow an authenticated user to rate a pet using a valid mood tag
- [x] The system must extract the `userId` from the authentication flow
- [x] The system must require a valid and existing `petId`
- [x] The system must require a valid predefined rating, mood tag based (enum)
  - Mood Tags: `cute`, `funny`, `majestic`, `chaos`, `smart`, `sleepy`.
- [x] The system must allow only **one rating per user per pet**
- [x] The system must use a toggle based behavior:
  - If no existing rating exists for (userId, petId): CREATE
  - If an existing rating exists with a different rate: UPDATE
  - If an existing rating exists with the same rate: NO-OP (idempotent)
- [x] The system must persist one user rating with `userId`, `petId`, and `rate`
- [x] The system must persist timestamps for rating creation and updates (`created_at`, `updated_at`)
- [x] The system must expose the endpoint `POST /pets/:id/rate`
- [x] Happy Path: The system must return **200 OK** with the rating status, e.g.:
  `{ petId: string, rate: string }`

## Non-Functional Requirements

- [x] The system must enforce uniqueness at db level for (user_id, pet_id) in the ratings table
- [x] The system must be idempotent for repeated requests (same rate)
- [x] The system must handle concurrent updates safely (no duplicate ratings)

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)

## Error Handling

- [x] Returns **400** when `petId` or `rate` is invalid/missing
- [x] Returns **401** when authentication token is missing, invalid, or expired
- [x] Returns **404** when the pet does not exist
- [x] Returns **500** for unexpected system failures