import { AppError } from "@application/errors/app-error";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import type { DeletePetRepository } from "@application/repositories/delete-pet.repository";
import type { DeletePostRepository } from "@application/repositories/delete-post.repository";
import type { FindPetWithDeletedRepository } from "@application/repositories/find-pet-with-deleted.repository";
import type { FindPublishedPostsRepository } from "@application/repositories/find-published-posts.repository";
import type {
  DeletePet,
  DeletePetDTO,
} from "@domain/usecases/delete-pet.contract";

export class DeletePetUseCase implements DeletePet {
  constructor(
    private readonly findPetWithDeletedRepository: FindPetWithDeletedRepository,
    private readonly deletePetRepository: DeletePetRepository,
    private readonly findPublishedPostsRepository: FindPublishedPostsRepository,
    private readonly deletePostRepository: DeletePostRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(data: DeletePetDTO): Promise<void> {
    await this.unitOfWork.execute(async (transactionClient) => {
      const pet =
        await this.findPetWithDeletedRepository.findByIdIncludingDeleted(
          data.pet_id,
          transactionClient,
        );

      if (!pet) {
        throw new AppError("NOT_FOUND", "The specified pet does not exist.");
      }

      if (pet.owner_id !== data.user_id) {
        throw new AppError(
          "FORBIDDEN",
          "You do not have permission to delete this pet.",
        );
      }

      if (pet.deleted_at) {
        return;
      }

      await this.deletePetRepository.softDeleteById(
        data.pet_id,
        transactionClient,
      );

      const relatedPublishedPosts =
        await this.findPublishedPostsRepository.findPublishedByPetId(
          data.pet_id,
          transactionClient,
        );

      for (const post of relatedPublishedPosts) {
        const deletedPost = post.delete();
        await this.deletePostRepository.deletePost(
          deletedPost,
          transactionClient,
        );
      }
    });
  }
}
