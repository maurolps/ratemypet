export type PostStatus = "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";

export type PostState = {
  id?: string;
  pet_id: string;
  author_id: string;
  caption: string;
  status: PostStatus;
  created_at: Date;
  likes_count: number;
  comments_count: number;
};

type CreatePostInput = {
  id?: string;
  pet_id: string;
  author_id: string;
  caption?: string;
  default_caption: string;
  created_at?: Date;
  likes_count?: number;
  comments_count?: number;
};

export class Post {
  private constructor(private readonly state: PostState) {}

  static create(data: CreatePostInput): Post {
    Post.ensureValid(data);

    const stateLikesCount = data.likes_count ?? 0;
    const stateCommentsCount = data.comments_count ?? 0;
    const stateCaption = data.caption || data.default_caption;

    const state: PostState = {
      id: data.id,
      pet_id: data.pet_id,
      author_id: data.author_id,
      caption: stateCaption,
      status: "PUBLISHED",
      created_at: data.created_at ?? new Date(),
      likes_count: stateLikesCount,
      comments_count: stateCommentsCount,
    };

    return new Post(state);
  }

  static rehydrate(state: PostState): Post {
    return new Post(state);
  }

  get toState() {
    return { ...this.state };
  }

  like(): Post {
    const state = this.toState;
    const updatedState: PostState = {
      ...state,
      likes_count: state.likes_count + 1,
    };

    return Post.rehydrate(updatedState);
  }

  unlike(): Post {
    const state = this.toState;
    const newLikesCount = Math.max(0, state.likes_count - 1);
    const updatedState: PostState = {
      ...state,
      likes_count: newLikesCount,
    };

    return Post.rehydrate(updatedState);
  }

  private static ensureValid(data: CreatePostInput) {
    if ((data.likes_count ?? 0) < 0) {
      throw new Error("Likes count cannot be negative.");
    }

    if ((data.comments_count ?? 0) < 0) {
      throw new Error("Comments count cannot be negative.");
    }
  }
}
