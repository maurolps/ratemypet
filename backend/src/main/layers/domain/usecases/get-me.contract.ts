import type { PetType } from "@domain/entities/pet";

export type GetMeStats = {
  postsCount: number;
  likesReceived: number;
};

export type GetMePet = {
  id: string;
  name: string;
  type: PetType;
  imageUrl: string;
};

export type GetMeProfile = {
  id: string;
  displayName: string;
  email: string;
  bio: string;
  stats: GetMeStats;
};

export type GetMeResult = GetMeProfile & {
  pets: GetMePet[];
};

export interface GetMeDTO {
  user_id: string;
}

export interface GetMe {
  execute(data: GetMeDTO): Promise<GetMeResult>;
}
