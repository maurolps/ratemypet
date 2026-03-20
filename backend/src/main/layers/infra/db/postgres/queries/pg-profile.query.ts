import type { GetProfilePetsQuery } from "@application/queries/get-profile-pets.query";
import type { GetProfileProfileQuery } from "@application/queries/get-profile-profile.query";
import type {
  GetProfileData,
  GetProfilePet,
} from "@domain/usecases/get-profile.contract";
import { PgPool } from "../helpers/pg-pool";
import { sql } from "../sql/profile.query.sql";

type ProfileRow = {
  id: string;
  display_name: string;
  bio: string;
  created_at: Date;
  picture: string | null;
  posts_count: number;
  likes_received: number;
};

type ProfilePetRow = {
  id: string;
  name: string;
  type: GetProfilePet["type"];
  image_url: string;
};

export class PgProfileQuery
  implements GetProfileProfileQuery, GetProfilePetsQuery
{
  private readonly pool: PgPool;

  constructor() {
    this.pool = PgPool.getInstance();
  }

  async findByUserId(user_id: string): Promise<GetProfileData | null> {
    const profileRows = await this.pool.query<ProfileRow>(sql.FIND_PROFILE, [
      user_id,
    ]);
    const profile = profileRows.rows[0] || null;

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      displayName: profile.display_name,
      bio: profile.bio,
      createdAt: profile.created_at,
      picture: profile.picture,
      stats: {
        postsCount: profile.posts_count,
        likesReceived: profile.likes_received,
      },
    };
  }

  async findByOwnerId(user_id: string): Promise<GetProfilePet[]> {
    const petRows = await this.pool.query<ProfilePetRow>(
      sql.FIND_PROFILE_PETS,
      [user_id],
    );

    return petRows.rows.map((petRow) => ({
      id: petRow.id,
      name: petRow.name,
      type: petRow.type,
      imageUrl: petRow.image_url,
    }));
  }
}
