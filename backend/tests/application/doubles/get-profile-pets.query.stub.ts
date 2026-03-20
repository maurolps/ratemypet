import type { GetProfilePetsQuery } from "@application/queries/get-profile-pets.query";

export class GetProfilePetsQueryStub implements GetProfilePetsQuery {
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
