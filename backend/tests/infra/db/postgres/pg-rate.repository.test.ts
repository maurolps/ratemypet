import { PgRateRepository } from "@infra/db/postgres/pg-rate.repository";
import { toRate, type RateRow } from "@infra/mappers/rate-mapper";
import { insertFakePet } from "./helpers/fake-pet";
import { generateFakeEmail } from "./helpers/fake-email";
import { insertFakeUser } from "./helpers/fake-user";
import { beforeAll, describe, expect, it } from "vitest";

describe("PgRateRepository", () => {
  const rateDTO = {
    petId: "",
    userId: "",
    rate: "cute" as const,
  };

  beforeAll(async () => {
    const owner = await insertFakeUser(generateFakeEmail("pg_rate_owner"));
    const rater = await insertFakeUser(generateFakeEmail("pg_rate_rater"));
    const pet = await insertFakePet(owner.id);

    rateDTO.petId = pet.id;
    rateDTO.userId = rater.id;
  });

  describe("PgRateRepository", () => {
    it("Should persist and return a Rate on success", async () => {
      const sut = new PgRateRepository();

      const rate = await sut.upsert(rateDTO);

      expect(rate.petId).toEqual(rateDTO.petId);
      expect(rate.userId).toEqual(rateDTO.userId);
      expect(rate.rate).toEqual("cute");
      expect(rate.createdAt).toBeInstanceOf(Date);
      expect(rate.updatedAt).toBeInstanceOf(Date);
    });

    it("Should return a Rate when it exists", async () => {
      const sut = new PgRateRepository();

      const rate = await sut.findByPetIdAndUserId(
        rateDTO.petId,
        rateDTO.userId,
      );

      expect(rate).not.toBeNull();
      expect(rate?.petId).toEqual(rateDTO.petId);
      expect(rate?.userId).toEqual(rateDTO.userId);
      expect(rate?.rate).toEqual("cute");
    });

    it("Should return null when rate does not exist", async () => {
      const sut = new PgRateRepository();

      const rate = await sut.findByPetIdAndUserId(
        crypto.randomUUID(),
        crypto.randomUUID(),
      );

      expect(rate).toBeNull();
    });

    it("Should delete an existing rate and return true", async () => {
      const sut = new PgRateRepository();
      await sut.upsert({
        ...rateDTO,
        rate: "sleepy",
      });

      const wasDeleted = await sut.deleteByPetIdAndUserId(
        rateDTO.petId,
        rateDTO.userId,
      );
      const deletedRate = await sut.findByPetIdAndUserId(
        rateDTO.petId,
        rateDTO.userId,
      );

      expect(wasDeleted).toBe(true);
      expect(deletedRate).toBeNull();
    });

    it("Should return false when deleting a non-existent rate", async () => {
      const sut = new PgRateRepository();

      const wasDeleted = await sut.deleteByPetIdAndUserId(
        crypto.randomUUID(),
        crypto.randomUUID(),
      );

      expect(wasDeleted).toBe(false);
    });

    it("Should remain idempotent when deleting the same rate repeatedly", async () => {
      const sut = new PgRateRepository();
      await sut.upsert({
        ...rateDTO,
        rate: "chaos",
      });

      const firstDelete = await sut.deleteByPetIdAndUserId(
        rateDTO.petId,
        rateDTO.userId,
      );
      const secondDelete = await sut.deleteByPetIdAndUserId(
        rateDTO.petId,
        rateDTO.userId,
      );

      expect(firstDelete).toBe(true);
      expect(secondDelete).toBe(false);
    });

    it("Should update an existing rate", async () => {
      const sut = new PgRateRepository();

      const updatedRate = await sut.upsert({
        ...rateDTO,
        rate: "majestic",
      });

      expect(updatedRate.petId).toEqual(rateDTO.petId);
      expect(updatedRate.userId).toEqual(rateDTO.userId);
      expect(updatedRate.rate).toEqual("majestic");
      expect(updatedRate.updatedAt).toBeInstanceOf(Date);
    });

    it("Should keep updatedAt unchanged when the same rate is upserted again", async () => {
      const sut = new PgRateRepository();
      const initialRate = await sut.upsert({
        ...rateDTO,
        rate: "smart",
      });

      await new Promise((resolve) => setTimeout(resolve, 20));
      const repeatedRate = await sut.upsert({
        ...rateDTO,
        rate: "smart",
      });

      expect(repeatedRate.updatedAt?.getTime()).toBe(
        initialRate.updatedAt?.getTime(),
      );
    });

    it("Should update updatedAt when a different rate is upserted", async () => {
      const sut = new PgRateRepository();
      const initialRate = await sut.upsert({
        ...rateDTO,
        rate: "cute",
      });

      await new Promise((resolve) => setTimeout(resolve, 20));
      const updatedRate = await sut.upsert({
        ...rateDTO,
        rate: "funny",
      });

      expect(updatedRate.updatedAt?.getTime()).toBeGreaterThan(
        initialRate.updatedAt?.getTime() ?? 0,
      );
    });

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
  });
});
