import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Post } from "@domain/entities/post";

export interface FindPublishedPostsRepository {
  findPublishedByPetId(
    petId: string,
    transaction?: Transaction,
  ): Promise<Post[]>;
}
