import type { PetType } from "@domain/entities/pet";

export type GetRankingItems = {
  items: {
    id: string;
    name: string;
    type: PetType;
    imageUrl: string;
    ratingsCount: number;
    ownerId: string;
    ownerDisplayName: string;
    createdAt: Date;
  }[];
};

export interface GetRankingDTO {
  type?: PetType;
}

export interface GetRanking {
  execute(data: GetRankingDTO): Promise<GetRankingItems>;
}
