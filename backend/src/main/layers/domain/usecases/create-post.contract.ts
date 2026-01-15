import type { Post } from "@domain/entities/post";

export interface CreatePostDTO {
  pet_id: string;
  author_id: string;
  caption: string;
}

export interface CreatePost {
  execute(postDTO: CreatePostDTO): Promise<Post>;
}
