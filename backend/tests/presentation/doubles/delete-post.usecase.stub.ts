import type {
  DeletePost,
  DeletePostDTO,
} from "@domain/usecases/delete-post.contract";

export class DeletePostUseCaseStub implements DeletePost {
  async execute(_: DeletePostDTO): Promise<void> {}
}
