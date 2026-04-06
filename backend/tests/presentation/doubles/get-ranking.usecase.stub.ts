import type {
  GetRanking,
  GetRankingDTO,
  GetRankingItems,
} from "@domain/usecases/get-ranking.contract";
import { FIXED_DATE } from "../../config/constants";

export class GetRankingUseCaseStub implements GetRanking {
  async execute(_: GetRankingDTO): Promise<GetRankingItems> {
    return {
      items: [
        {
          id: "valid_pet_id",
          name: "valid_pet_name",
          type: "dog",
          imageUrl: "https://valid.image/pet.png",
          ratingsCount: 7,
          ownerId: "valid_owner_id",
          ownerDisplayName: "valid_owner_display_name",
          createdAt: FIXED_DATE,
        },
      ],
    };
  }
}
