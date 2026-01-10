import type { Pet, UnsavedPet } from "@domain/entities/pet";
import type { UploadPetRepository } from "@application/repositories/upload-pet.repository";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/pet.sql";

export class PgPetRepository implements UploadPetRepository {
  private readonly pool: PgPool;
  constructor() {
    this.pool = PgPool.getInstance();
  }

  async save(unsavedPet: UnsavedPet): Promise<Pet> {
    const { petName: name, type, image_url, caption, owner_id } = unsavedPet;
    const petRows = await this.pool.query<Pet>(sql.SAVE_PET, [
      owner_id,
      name,
      type,
      image_url,
      caption,
    ]);
    const pet = petRows.rows[0];
    return pet;
  }

  async countByOwnerId(ownerId: string): Promise<number> {
    const countRows = await this.pool.query<{ count: string }>(
      sql.COUNT_PETS_BY_OWNER_ID,
      [ownerId],
    );
    const count = Number(countRows.rows[0].count);
    return count;
  }
}
