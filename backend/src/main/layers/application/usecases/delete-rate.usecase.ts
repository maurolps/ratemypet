import { AppError } from "@application/errors/app-error";
import type { DeleteRateRepository } from "@application/repositories/delete-rate.repository";
import type { FindPetRepository } from "@application/repositories/find-pet.repository";
import type {
  DeleteRate,
  DeleteRateDTO,
  DeleteRateResult,
} from "@domain/usecases/delete-rate.contract";

export class DeleteRateUseCase implements DeleteRate {
  constructor(
    private readonly findPetRepository: FindPetRepository,
    private readonly deleteRateRepository: DeleteRateRepository,
  ) {}

  async execute(data: DeleteRateDTO): Promise<DeleteRateResult> {
    const pet = await this.findPetRepository.findById(data.petId);

    if (!pet) {
      throw new AppError("NOT_FOUND", "The specified pet does not exist.");
    }

    const wasDeleted = await this.deleteRateRepository.deleteByPetIdAndUserId(
      data.petId,
      data.userId,
    );

    return {
      petId: data.petId,
      status: wasDeleted ? "deleted" : "unchanged",
    };
  }
}
