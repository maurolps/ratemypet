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
  ratingsCount: number;
};

export type GetMeProfile = {
  id: string;
  displayName: string;
  email: string;
  bio: string;
  createdAt: Date;
  picture: string | null;
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
