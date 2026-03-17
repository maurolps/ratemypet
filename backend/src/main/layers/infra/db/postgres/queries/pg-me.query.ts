import type { GetMePetsQuery } from "@application/queries/get-me-pets.query";
import type { GetMeProfileQuery } from "@application/queries/get-me-profile.query";
import type { GetMePet, GetMeProfile } from "@domain/usecases/get-me.contract";
import { PgPool } from "../helpers/pg-pool";
import { sql } from "../sql/me.query.sql";

type MeProfileRow = {
  id: string;
  display_name: string;
  email: string;
  bio: string;
  posts_count: number;
  likes_received: number;
};

type MePetRow = {
  id: string;
  name: string;
  type: GetMePet["type"];
  image_url: string;
};

export class PgMeQuery implements GetMeProfileQuery, GetMePetsQuery {
  private readonly pool: PgPool;

  constructor() {
    this.pool = PgPool.getInstance();
  }

  async findByUserId(user_id: string): Promise<GetMeProfile | null> {
    const profileRows = await this.pool.query<MeProfileRow>(
      sql.FIND_ME_PROFILE,
      [user_id],
    );
    const profile = profileRows.rows[0] || null;

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      displayName: profile.display_name,
      email: profile.email,
      bio: profile.bio,
      stats: {
        postsCount: profile.posts_count,
        likesReceived: profile.likes_received,
      },
    };
  }

  async findByOwnerId(user_id: string): Promise<GetMePet[]> {
    const petRows = await this.pool.query<MePetRow>(sql.FIND_ME_PETS, [
      user_id,
    ]);

    return petRows.rows.map((petRow) => ({
      id: petRow.id,
      name: petRow.name,
      type: petRow.type,
      imageUrl: petRow.image_url,
    }));
  }
}
