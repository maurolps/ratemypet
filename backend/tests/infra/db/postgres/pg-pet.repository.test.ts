import { it, describe, expect, beforeAll } from "vitest";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";
import type { UnsavedPet } from "@domain/entities/pet";
import { insertFakeUser } from "./helpers/fake-user";

describe("PgPetRepository", () => {
  const unsavedPet: UnsavedPet = {
    petName: "valid_pet_name",
    owner_id: "",
    type: "dog",
    image_url: "https://valid.image.url/pet.png",
    caption: "Generated caption for the pet",
  };

  describe("save", () => {
    beforeAll(async () => {
      const user = await insertFakeUser("fake_email2@mail.com");
      unsavedPet.owner_id = user.id;
    });

    it("Should persist and return a Pet on success", async () => {
      const sut = new PgPetRepository();
      const pet = await sut.save(unsavedPet);
      expect(pet.id).toBeTruthy();
      expect(pet.name).toEqual(unsavedPet.petName);
      expect(pet.type).toEqual(unsavedPet.type);
      expect(pet.image_url).toEqual(unsavedPet.image_url);
      expect(pet.caption).toEqual(unsavedPet.caption);
      expect(pet.created_at).toBeInstanceOf(Date);
    });
  });

  it("Should return the correct count of pets for a given owner ID", async () => {
    const sut = new PgPetRepository();
    const count = await sut.countByOwnerId(unsavedPet.owner_id);
    expect(count).toBe(1);
  });
});
