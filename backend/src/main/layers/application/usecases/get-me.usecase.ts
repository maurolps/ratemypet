import { AppError } from "@application/errors/app-error";
import type { GetMePetsQuery } from "@application/queries/get-me-pets.query";
import type { GetMeProfileQuery } from "@application/queries/get-me-profile.query";
import type {
  GetMe,
  GetMeDTO,
  GetMeResult,
} from "@domain/usecases/get-me.contract";

export class GetMeUseCase implements GetMe {
  constructor(
    private readonly getMeProfileQuery: GetMeProfileQuery,
    private readonly getMePetsQuery: GetMePetsQuery,
  ) {}

  async execute(data: GetMeDTO): Promise<GetMeResult> {
    const profile = await this.getMeProfileQuery.findByUserId(data.user_id);

    if (!profile) {
      throw new AppError("NOT_FOUND", "The authenticated user does not exist.");
    }

    const pets = await this.getMePetsQuery.findByOwnerId(data.user_id);

    return {
      ...profile,
      pets,
    };
  }
}
