import type { FindPetRepository } from "@application/repositories/find-pet.repository";
import type { RateRepository } from "@application/repositories/rate.repository";
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
  ) {}

  async execute(data: RatePetDTO): Promise<RatePetResult> {
    const pet = await this.findPetRepository.findById(data.petId);

    if (!pet) {
      throw new AppError("NOT_FOUND", "The specified pet does not exist.");
    }

    const updatedRate = await this.rateRepository.upsert(data);

    return {
      petId: updatedRate.petId,
      rate: updatedRate.rate,
    };
  }
}
