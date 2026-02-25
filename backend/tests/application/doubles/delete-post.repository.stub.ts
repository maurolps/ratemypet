import type { DeletePostRepository } from "@application/repositories/delete-post.repository";
import type { Post } from "@domain/entities/post";

export class DeletePostRepositoryStub implements DeletePostRepository {
  async deletePost(_: Post): Promise<void> {}
}
