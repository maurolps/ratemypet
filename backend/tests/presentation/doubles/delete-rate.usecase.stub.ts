import type {
  DeleteRate,
  DeleteRateDTO,
  DeleteRateResult,
} from "@domain/usecases/delete-rate.contract";

export class DeleteRateUseCaseStub implements DeleteRate {
  async execute(_: DeleteRateDTO): Promise<DeleteRateResult> {
    return {
      petId: "valid_pet_id",
      status: "deleted",
    };
  }
}
