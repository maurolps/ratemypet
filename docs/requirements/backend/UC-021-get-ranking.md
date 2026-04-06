# Get Ranking - Requirements

## Functional Requirements

- [x] The system must allow any user to fetch the pets ranking
- [x] The system must expose a public endpoint `GET /pets/ranking`
- [x] The system must ignore authentication if a token is provided
- [x] The system must return a ranked list of pets
- [x] The ranking must be based on `pets.ratings_count`
- [x] The system must order ranking items by `ratings_count` descending
- [x] The system must use `created_at` descending as tie-breaker when `ratings_count` is equal
- [x] The system must return only pets with `ratings_count > 0`
- [x] The system must exclude soft-deleted pets from the ranking
- [x] The system must support filtering ranking by pet `type` (`dog` or `cat`, default to all types)
- [x] The system must return a fixed top 10 ranking
- [x] The system must return a JSON object with an `items` array
- [x] The `items` array must contain pets in the following format: (`id`, `name`, `type`, `imageUrl`, `ratingsCount`, `ownerId`, `ownerDisplayName`, `createdAt`)
- [x] Happy Path: The system must return **200 OK** with the shape `{ items: [] }`

## Non-Functional Requirements

- [x] The system must use the denormalized value `pets.ratings_count` as the source for ranking order
- [x] The system must avoid N+1 queries when resolving ranked pets
- [x] The system must support efficient filtering by pet `type`
- [x] The system must implement rate limiting to prevent abuse on ranking endpoint

## TDD

- [x] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [x] E2E test must cover only happy path scenario

## Error Handling

- [x] Returns **400** when the `type` query parameter is invalid (not `dog`, `cat`)
- [x] Returns **500** for unexpected system failures
