import type { PetType } from "@domain/entities/pet";
import type { GetRankingItems } from "@domain/usecases/get-ranking.contract";

export type GetRankingInput = {
  type?: PetType;
};

export interface GetRankingQuery {
  getRanking(data: GetRankingInput): Promise<GetRankingItems>;
}
