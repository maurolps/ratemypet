import { Post } from "@domain/entities/post";
import type { FindPublishedPostsRepository } from "@application/repositories/find-published-posts.repository";
import { FIXED_DATE } from "../../config/constants";

export class FindPublishedPostsRepositoryStub
  implements FindPublishedPostsRepository
{
  async findPublishedByPetId(petId: string): Promise<Post[]> {
    return [
      Post.rehydrate({
        id: "valid_post_id",
        pet_id: petId,
        author_id: "valid_owner_id",
        caption: "valid_caption",
        status: "PUBLISHED",
        created_at: FIXED_DATE,
        likes_count: 0,
        comments_count: 0,
      }),
    ];
  }
}
