import { AppError } from "@application/errors/app-error";
import type { DeleteRateRepository } from "@application/repositories/delete-rate.repository";
import type { FindPetRepository } from "@application/repositories/find-pet.repository";
import type { UpdatePetRatingsCountRepository } from "@application/repositories/update-pet-ratings-count.repository";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import type {
  DeleteRate,
  DeleteRateDTO,
  DeleteRateResult,
} from "@domain/usecases/delete-rate.contract";

export class DeleteRateUseCase implements DeleteRate {
  constructor(
    private readonly findPetRepository: FindPetRepository,
    private readonly deleteRateRepository: DeleteRateRepository,
    private readonly updatePetRatingsCountRepository: UpdatePetRatingsCountRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(data: DeleteRateDTO): Promise<DeleteRateResult> {
    const pet = await this.findPetRepository.findById(data.petId);

    if (!pet) {
      throw new AppError("NOT_FOUND", "The specified pet does not exist.");
    }

    return await this.unitOfWork.execute(async (transactionClient) => {
      const wasDeleted = await this.deleteRateRepository.deleteByPetIdAndUserId(
        data.petId,
        data.userId,
        transactionClient,
      );

      if (!wasDeleted) {
        return {
          petId: data.petId,
          status: "unchanged",
        };
      }

      await this.updatePetRatingsCountRepository.decrementRatingsCount(
        data.petId,
        transactionClient,
      );

      return {
        petId: data.petId,
        status: "deleted",
      };
    });
  }
}
