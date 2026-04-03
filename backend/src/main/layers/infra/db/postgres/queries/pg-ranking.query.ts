import type {
  GetRankingInput,
  GetRankingQuery,
} from "@application/queries/get-ranking.query";
import type { GetRankingItems } from "@domain/usecases/get-ranking.contract";
import { PgPool } from "../helpers/pg-pool";
import { sql } from "../sql/ranking.query.sql";

type RankingRow = {
  id: string;
  name: string;
  type: GetRankingItems["items"][number]["type"];
  image_url: string;
  ratings_count: number;
  owner_id: string;
  owner_display_name: string;
  created_at: Date;
};

export class PgRankingQuery implements GetRankingQuery {
  private readonly pool: PgPool;

  constructor() {
    this.pool = PgPool.getInstance();
  }

  async getRanking(data: GetRankingInput): Promise<GetRankingItems> {
    const rankingRows = await this.pool.query<RankingRow>(sql.FIND_RANKING, [
      data.type ?? null,
    ]);

    return {
      items: rankingRows.rows.map((rankingRow) => ({
        id: rankingRow.id,
        name: rankingRow.name,
        type: rankingRow.type,
        imageUrl: rankingRow.image_url,
        ratingsCount: rankingRow.ratings_count,
        ownerId: rankingRow.owner_id,
        ownerDisplayName: rankingRow.owner_display_name,
        createdAt: rankingRow.created_at,
      })),
    };
  }
}
