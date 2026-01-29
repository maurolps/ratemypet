import type { Like } from "@domain/entities/like";

export interface LikeRepository {
  exists(like: Like): Promise<Like | null>;
  save(data: Like): Promise<Like>;
}
