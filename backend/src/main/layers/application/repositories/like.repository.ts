import type { Like } from "@domain/entities/like";
import type { Transaction } from "@application/ports/unit-of-work.contract";

export interface LikeRepository {
  exists(like: Like, transaction?: Transaction): Promise<Like | null>;
  save(like: Like, transaction?: Transaction): Promise<Like>;
}
