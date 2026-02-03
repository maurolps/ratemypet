import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Post } from "@domain/entities/post";

export interface FindPostRepository {
  findById(id: string, transaction?: Transaction): Promise<Post | null>;
}
