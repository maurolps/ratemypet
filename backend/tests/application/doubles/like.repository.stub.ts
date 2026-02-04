import type { Like } from "@domain/entities/like";
import type { LikeRepository } from "@application/repositories/like.repository";
import { FIXED_DATE } from "../../config/constants";

export class LikeRepositoryStub implements LikeRepository {
  async exists(_: Like): Promise<Like | null> {
    return null;
  }

  async save(data: Like): Promise<Like> {
    return {
      post_id: data.post_id,
      user_id: data.user_id,
      created_at: FIXED_DATE,
    };
  }
}
