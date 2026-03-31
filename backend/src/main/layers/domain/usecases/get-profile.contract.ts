import type { PetType } from "@domain/entities/pet";

export type GetProfileStats = {
  postsCount: number;
  likesReceived: number;
};

export type GetProfilePet = {
  id: string;
  name: string;
  type: PetType;
  imageUrl: string;
  ratingsCount: number;
};

export type GetProfileData = {
  id: string;
  displayName: string;
  bio: string;
  createdAt: Date;
  picture: string | null;
  stats: GetProfileStats;
};

export type GetProfileResult = GetProfileData & {
  pets: GetProfilePet[];
};

export interface GetProfileDTO {
  user_id: string;
}

export interface GetProfile {
  execute(data: GetProfileDTO): Promise<GetProfileResult>;
}
