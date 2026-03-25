import type {
  RatePet,
  RatePetDTO,
  RatePetResult,
} from "@domain/usecases/rate-pet.contract";

export class RatePetUseCaseStub implements RatePet {
  async execute(_: RatePetDTO): Promise<RatePetResult> {
    return {
      petId: "valid_pet_id",
      rate: "majestic",
    };
  }
}
