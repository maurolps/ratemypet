import type { Pet } from "@domain/entities/pet";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { sql } from "@infra/db/postgres/sql/pet.sql";

export const insertFakePet = async (ownerId: string): Promise<Pet> => {
  const pool = PgPool.getInstance();
  const petRows = await pool.query<Pet>(sql.SAVE_PET, [
    ownerId,
    "fake_pet_name",
    "dog",
    "https://fake.image.url/pet.png",
    "Fake pet caption",
  ]);
  const pet = petRows.rows[0];
  return pet;
};
