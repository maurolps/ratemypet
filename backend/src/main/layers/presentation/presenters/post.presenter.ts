import type { Post } from "@domain/entities/post";

export const postPresenter = (post: Post) => {
  const state = post.toState;

  return {
    id: state.id,
    pet_id: state.pet_id,
    author_id: state.author_id,
    caption: state.caption,
    status: state.status,
    created_at: state.created_at,
    likes_count: state.likes_count,
    comments_count: state.comments_count,
  };
};
