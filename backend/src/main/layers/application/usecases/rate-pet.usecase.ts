import type { FindPetRepository } from "@application/repositories/find-pet.repository";
import type { RateRepository } from "@application/repositories/rate.repository";
import type { UpdatePetRatingsCountRepository } from "@application/repositories/update-pet-ratings-count.repository";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import { AppError } from "@application/errors/app-error";
import type {
  RatePet,
  RatePetDTO,
  RatePetResult,
} from "@domain/usecases/rate-pet.contract";

export class RatePetUseCase implements RatePet {
  constructor(
    private readonly findPetRepository: FindPetRepository,
    private readonly rateRepository: RateRepository,
    private readonly updatePetRatingsCountRepository: UpdatePetRatingsCountRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(data: RatePetDTO): Promise<RatePetResult> {
    const pet = await this.findPetRepository.findById(data.petId);

    if (!pet) {
      throw new AppError("NOT_FOUND", "The specified pet does not exist.");
    }

    return await this.unitOfWork.execute(async (transactionClient) => {
      const upsertResult = await this.rateRepository.upsert(
        data,
        transactionClient,
      );

      if (upsertResult.operation === "created") {
        await this.updatePetRatingsCountRepository.incrementRatingsCount(
          data.petId,
          transactionClient,
        );
      }

      return {
        petId: upsertResult.rate.petId,
        rate: upsertResult.rate.rate,
      };
    });
  }
}
