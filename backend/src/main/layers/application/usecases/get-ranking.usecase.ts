import type { GetRankingQuery } from "@application/queries/get-ranking.query";
import type {
  GetRanking,
  GetRankingDTO,
  GetRankingItems,
} from "@domain/usecases/get-ranking.contract";

export class GetRankingUseCase implements GetRanking {
  constructor(private readonly getRankingQuery: GetRankingQuery) {}

  async execute(data: GetRankingDTO): Promise<GetRankingItems> {
    return this.getRankingQuery.getRanking({
      type: data.type,
    });
  }
}
