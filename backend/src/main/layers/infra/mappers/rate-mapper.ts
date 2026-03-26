import type { Rate } from "@domain/entities/rate";

export type RateRow = {
  pet_id: string;
  user_id: string;
  rate: Rate["rate"];
  created_at: Date | string;
  updated_at: Date | string;
};

export const toRate = (row: RateRow): Rate => {
  return {
    petId: row.pet_id,
    userId: row.user_id,
    rate: row.rate,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at
        : new Date(row.created_at),
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at
        : new Date(row.updated_at),
  };
};
