import type {
  GetRankingInput,
  GetRankingQuery,
} from "@application/queries/get-ranking.query";
import type { GetRankingItems } from "@domain/usecases/get-ranking.contract";
import { FIXED_DATE } from "../../config/constants";

export class GetRankingQueryStub implements GetRankingQuery {
  async getRanking(_: GetRankingInput): Promise<GetRankingItems> {
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
