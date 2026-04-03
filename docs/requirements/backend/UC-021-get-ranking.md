# Get Ranking - Requirements

## Functional Requirements

- [ ] The system must allow any user to fetch the pets ranking
- [ ] The system must expose a public endpoint `GET /pets/ranking`
- [ ] The system must ignore authentication if a token is provided
- [ ] The system must return a ranked list of pets
- [ ] The ranking must be based on `pets.ratings_count`
- [ ] The system must order ranking items by `ratings_count` descending
- [ ] The system must use `created_at` descending as tie-breaker when `ratings_count` is equal
- [ ] The system must return only pets with `ratings_count > 0`
- [ ] The system must exclude soft-deleted pets from the ranking
- [ ] The system must support filtering ranking by pet `type` (`dog` or `cat`, default to all types)
- [ ] The system must return a fixed top 10 ranking
- [ ] The system must return pets in the following format: (`id`, `name`, `type`, `imageUrl`, `ratingsCount`, `ownerId`, `ownerDisplayName`, `createdAt`)
- [ ] Happy Path: The system must return **200 OK** with the ranking list (or empty list)

## Non-Functional Requirements

- [ ] The system must use the denormalized value `pets.ratings_count` as the source for ranking order
- [ ] The system must avoid N+1 queries when resolving ranked pets
- [ ] The system must support efficient filtering by pet `type`
- [ ] The system must implement rate limiting to prevent abuse on ranking endpoint

## TDD

- [ ] Test Coverage: 100% across all layers (domain, application, presentation, infrastructure)
- [ ] E2E test must cover only happy path scenario

## Error Handling

- [ ] Returns **400** when the `type` query parameter is invalid (not `dog`, `cat`)
- [ ] Returns **500** for unexpected system failures
