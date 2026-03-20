import type { GetMePetsQuery } from "@application/queries/get-me-pets.query";

export class GetMePetsQueryStub implements GetMePetsQuery {
  async findByOwnerId(_user_id: string) {
    return [
      {
        id: "valid_pet_id",
        name: "valid_pet_name",
        type: "dog" as const,
        imageUrl: "https://valid.image/pet.png",
      },
    ];
  }
}
