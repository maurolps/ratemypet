import type { GetProfilePet } from "@domain/usecases/get-profile.contract";

export interface GetProfilePetsQuery {
  findByOwnerId(user_id: string): Promise<GetProfilePet[]>;
}
