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
    const { petName: name, type, image_url, caption } = unsavedPet;
    const petRows = await this.pool.query<Pet>(sql.SAVE_PET, [
      name,
      type,
      image_url,
      caption,
    ]);
    const pet = petRows.rows[0];
    return pet;
  }
}
