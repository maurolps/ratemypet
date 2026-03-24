# Rate Pet - Requirements

## Functional Requirements

- [ ] The system must allow an authenticated user to rate a pet using a valid mood tag
- [ ] The system must require a valid and existing `petId`
- [ ] The system must require a valid predefined rating, mood tag based (enum)
  - Mood Tags: `cute`, `funny`, `majestic`, `chaos`, `smart`, `sleepy`.
- [ ] The system must allow only **one rating per user per pet**
- [ ] The system must persist one user rating with `userId`, `petId`, and `rate` (nullable)
- [ ] The system must persist timestamps for rating creation and updates (`created_at`, `updated_at`)
- [ ] The system must use a toggle based behavior:
  - If no existing rating exists for (userId, petId): CREATE
  - If an existing rating exists with a different rate: UPDATE
  - If an existing rating exists with the same rate: DELETE
- [ ] The system must expose the endpoint `POST /pets/:id/rate`
- [ ] Happy Path: The system must return **200 OK** with the rating status, e.g.:
  `{ petId: string, rate: string | null, "status": "created" | "updated" | "removed" }`

## Non-Functional Requirements

- [ ] The system must enforce uniqueness at db level for (user_id, pet_id) in the ratings table
- [ ] The system must ensure fast lookup for `viewer_rating` using indexed queries
- [ ] The system must be idempotent for repeated requests (same mood tag)
- [ ] The system must handle concurrent updates safely (no duplicate ratings)

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)

## Error Handling

- [ ] Returns **400** when `petId` or `rate` is invalid
- [ ] Returns **401** when authentication token is missing, invalid, or expired
- [ ] Returns **404** when the pet does not exist
- [ ] Returns **500** for unexpected system failures