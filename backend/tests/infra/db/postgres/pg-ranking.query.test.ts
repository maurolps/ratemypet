import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { PgRankingQuery } from "@infra/db/postgres/queries/pg-ranking.query";
import { generateFakeEmail } from "./helpers/fake-email";
import { insertFakePet } from "./helpers/fake-pet";
import { insertFakeUser } from "./helpers/fake-user";
import { describe, expect, it, vi } from "vitest";

describe("PgRankingQuery", () => {
  const sut = new PgRankingQuery();
  const pool = PgPool.getInstance();

  it("Should filter ranking by dog and cat", async () => {
    const owner = await insertFakeUser(generateFakeEmail("pg_ranking_filter"));
    const dogPet = await insertFakePet(owner.id, {
      name: `ranking_dog_${crypto.randomUUID()}`,
      type: "dog",
      ratingsCount: 3000,
      createdAt: new Date(11),
    });
    const catPet = await insertFakePet(owner.id, {
      name: `ranking_cat_${crypto.randomUUID()}`,
      type: "cat",
      ratingsCount: 2999,
      createdAt: new Date(12),
    });

    const dogResult = await sut.getRanking({
      type: "dog",
    });
    const catResult = await sut.getRanking({
      type: "cat",
    });

    expect(dogResult.items.some((item) => item.name === dogPet.name)).toBe(
      true,
    );
    expect(dogResult.items.some((item) => item.name === catPet.name)).toBe(
      false,
    );
    expect(catResult.items.some((item) => item.name === catPet.name)).toBe(
      true,
    );
    expect(catResult.items.some((item) => item.name === dogPet.name)).toBe(
      false,
    );
  });

  it("Should return owner display name using a single query", async () => {
    const displayName = `ranking_owner_name_${crypto.randomUUID()}`;
    const owner = await insertFakeUser(
      generateFakeEmail("pg_ranking_owner"),
      null,
      displayName,
    );
    const rankedPet = await insertFakePet(owner.id, {
      name: `ranking_owner_pet_${crypto.randomUUID()}`,
      ratingsCount: 6000,
      createdAt: new Date("2104-01-01T00:00:00.000Z"),
    });
    const querySpy = vi.spyOn(pool, "query");

    const result = await sut.getRanking({
      type: "dog",
    });

    const rankingItem = result.items.find(
      (item) => item.name === rankedPet.name,
    );

    expect(querySpy).toHaveBeenCalledTimes(1);
    expect(rankingItem?.ownerDisplayName).toBe(displayName);

    querySpy.mockRestore();
  });
});
