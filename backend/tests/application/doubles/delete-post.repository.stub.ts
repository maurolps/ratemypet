import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { DeletePostRepository } from "@application/repositories/delete-post.repository";
import type { Post } from "@domain/entities/post";

export class DeletePostRepositoryStub implements DeletePostRepository {
  async deletePost(_: Post, __?: Transaction): Promise<void> {}
}
