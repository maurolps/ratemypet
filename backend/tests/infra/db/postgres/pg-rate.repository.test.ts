import { PgRateRepository } from "@infra/db/postgres/pg-rate.repository";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { insertFakePet } from "./helpers/fake-pet";
import { generateFakeEmail } from "./helpers/fake-email";
import { insertFakeUser } from "./helpers/fake-user";
import { beforeAll, describe, expect, it, vi } from "vitest";

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

      const result = await sut.upsert(rateDTO);
      const rate = result.rate;

      expect(rate.petId).toEqual(rateDTO.petId);
      expect(rate.userId).toEqual(rateDTO.userId);
      expect(rate.rate).toEqual("cute");
      expect(rate.createdAt).toBeInstanceOf(Date);
      expect(rate.updatedAt).toBeInstanceOf(Date);
      expect(result.wasCreated).toBe(true);
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

    it("Should return false when delete query returns undefined rowCount", async () => {
      const sut = new PgRateRepository();
      const pool = PgPool.getInstance();
      const querySpy = vi.spyOn(pool, "query").mockResolvedValueOnce({
        rows: [],
        rowCount: null,
      });

      const wasDeleted = await sut.deleteByPetIdAndUserId(
        rateDTO.petId,
        rateDTO.userId,
      );

      expect(querySpy).toHaveBeenCalled();
      expect(wasDeleted).toBe(false);
    });

    it("Should update an existing rate", async () => {
      const sut = new PgRateRepository();
      await sut.upsert({
        ...rateDTO,
        rate: "cute",
      });

      const result = await sut.upsert({
        ...rateDTO,
        rate: "majestic",
      });
      const updatedRate = result.rate;

      expect(updatedRate.petId).toEqual(rateDTO.petId);
      expect(updatedRate.userId).toEqual(rateDTO.userId);
      expect(updatedRate.rate).toEqual("majestic");
      expect(updatedRate.updatedAt).toBeInstanceOf(Date);
      expect(result.wasCreated).toBe(false);
    });

    it("Should upsert a rate inside a transaction", async () => {
      const sut = new PgRateRepository();
      const query = vi.fn().mockResolvedValue({
        rows: [
          {
            pet_id: rateDTO.petId,
            user_id: rateDTO.userId,
            rate: "funny",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        rowCount: 1,
      });
      const transaction = {
        query,
      };

      await sut.upsert(
        {
          ...rateDTO,
          rate: "funny",
        },
        transaction,
      );
      expect(transaction.query).toHaveBeenCalled();
    });

    it("Should keep updatedAt unchanged when the same rate is upserted again", async () => {
      const sut = new PgRateRepository();
      const initialResult = await sut.upsert({
        ...rateDTO,
        rate: "smart",
      });
      const initialRate = initialResult.rate;

      await new Promise((resolve) => setTimeout(resolve, 20));
      const repeatedResult = await sut.upsert({
        ...rateDTO,
        rate: "smart",
      });
      const repeatedRate = repeatedResult.rate;

      expect(repeatedRate.updatedAt?.getTime()).toBe(
        initialRate.updatedAt?.getTime(),
      );
      expect(repeatedResult.wasCreated).toBe(false);
    });

    it("Should update updatedAt when a different rate is upserted", async () => {
      const sut = new PgRateRepository();
      const initialResult = await sut.upsert({
        ...rateDTO,
        rate: "cute",
      });
      const initialRate = initialResult.rate;

      await new Promise((resolve) => setTimeout(resolve, 20));
      const updatedResult = await sut.upsert({
        ...rateDTO,
        rate: "funny",
      });
      const updatedRate = updatedResult.rate;

      expect(updatedRate.updatedAt?.getTime()).toBeGreaterThan(
        initialRate.updatedAt?.getTime() ?? 0,
      );
      expect(updatedResult.wasCreated).toBe(false);
    });
  });
});
