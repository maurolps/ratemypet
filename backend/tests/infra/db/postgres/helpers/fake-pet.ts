import type { Pet, PetType } from "@domain/entities/pet";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";

type InsertFakePetOptions = {
  id?: string;
  name?: string;
  type?: PetType;
  imageUrl?: string;
  caption?: string;
  createdAt?: Date;
  deletedAt?: Date | null;
  ratingsCount?: number;
};

export const insertFakePet = async (
  ownerId: string,
  options?: InsertFakePetOptions,
): Promise<Pet> => {
  const pool = PgPool.getInstance();

  const petRows = await pool.query<Pet>(
    `
      INSERT INTO pets (
        id,
        owner_id,
        name,
        type,
        image_url,
        caption,
        created_at,
        deleted_at,
        ratings_count
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, owner_id, name, type, image_url, caption, created_at, deleted_at, ratings_count
    `,
    [
      options?.id ?? crypto.randomUUID(),
      ownerId,
      options?.name ?? "fake_pet_name",
      options?.type ?? "dog",
      options?.imageUrl ?? "https://fake.image.url/pet.png",
      options?.caption ?? "Fake pet caption",
      options?.createdAt ?? new Date(),
      options?.deletedAt ?? null,
      options?.ratingsCount ?? 0,
    ],
  );

  const pet = petRows.rows[0];
  return pet;
};
