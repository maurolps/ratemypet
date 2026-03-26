import { describe, expect, it } from "vitest";
import { toRate, type RateRow } from "@infra/mappers/rate-mapper";

describe("toRate", () => {
  it("Should map a RateRow to camelCase Rate", () => {
    const row: RateRow = {
      pet_id: "valid_pet_id",
      user_id: "valid_user_id",
      rate: "smart",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const rate = toRate(row);

    expect(rate).toEqual({
      petId: row.pet_id,
      userId: row.user_id,
      rate: row.rate,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  });

  it("Should map string timestamps from RateRow to Date values", () => {
    const row: RateRow = {
      pet_id: "valid_pet_id",
      user_id: "valid_user_id",
      rate: "sleepy",
      created_at: "2026-03-25T12:00:00.000Z",
      updated_at: "2026-03-25T13:00:00.000Z",
    };

    const rate = toRate(row);

    expect(rate).toEqual({
      petId: row.pet_id,
      userId: row.user_id,
      rate: row.rate,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  });
});
