# Like Post - Requirements

## Functional Requirements

- [ ] The system must allow only authenticated users to like a post.
- [ ] The system must require a valid and existing `postId`.
- [ ] The system must allow users to like their own posts only once.
- [ ] The system must prevent duplicate likes from the same user on the same post.
- [ ] The system must persist a like record in the database when it does not already exist.
- [ ] The system must associate the like with the post id.
- [ ] The system must update `Post.likes_count` only through the `Post` Aggregate Root.
- [ ] The system must not increment the post `like_count` when the post is already liked by the user.
- [ ] The system must be resilient to duplicate submissions (idempotent).
- [ ] Happy Path: The system must return **200** with the `postId`, `likeId` and updated `likes_count`.


## Non-Functional Requirements

- [ ] The system must enforce database integrity through foreign keys and constraints.
- [ ] The system must enforce a unique constraint for `(post_id, user_id)`.
- [ ] The system should execute like creation atomically.
- [ ] The system must be compatible with future unlike workflows.
- [ ] The system must guarantee consistency between the `likes` table and `Post.likes_count` under concurrency
- [ ] The system must implement rate limiting to prevent abuse on the like feature.


## Error Handling

- [ ] Returns **400** when required parameters are missing.
- [ ] Returns **400** when parameters have invalid types.
- [ ] Returns **401** when the user is not authenticated.
- [ ] Returns **404** when the post does not exist.
- [ ] Returns **409** when the user has already liked the post.
- [ ] Returns **500** for unexpected system failures.
