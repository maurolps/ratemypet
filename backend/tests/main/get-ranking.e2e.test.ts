import type { Express } from "express";
import { makeApp } from "@main/http/app";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("[E2E] UC-021 GetRanking", () => {
  let app: Express;
  let ownerId: string;

  beforeAll(async () => {
    app = makeApp();

    const owner = await createAndLoginUser(app);
    ownerId = owner.userId;
  });

  it("Should return 200 and the ranking items without auth", async () => {
    const topPetName = `ranking_e2e_top_${crypto.randomUUID()}`;
    const secondPetName = `ranking_e2e_second_${crypto.randomUUID()}`;
    const excludedPetName = `ranking_e2e_excluded_${crypto.randomUUID()}`;
    const topCreatedAt = new Date("2110-01-02T00:00:00.000Z");

    const topPet = await insertFakePet(ownerId, {
      name: topPetName,
      type: "dog",
      ratingsCount: 7000,
      createdAt: topCreatedAt,
      imageUrl: `https://images.example/${topPetName}.png`,
      caption: `${topPetName}_caption`,
    });
    await insertFakePet(ownerId, {
      name: secondPetName,
      type: "cat",
      ratingsCount: 6999,
      createdAt: new Date("2110-01-01T00:00:00.000Z"),
      imageUrl: `https://images.example/${secondPetName}.png`,
      caption: `${secondPetName}_caption`,
    });
    await insertFakePet(ownerId, {
      name: excludedPetName,
      type: "dog",
      ratingsCount: 0,
      createdAt: new Date("2110-01-03T00:00:00.000Z"),
      imageUrl: `https://images.example/${excludedPetName}.png`,
      caption: `${excludedPetName}_caption`,
    });

    const response = await request(app).get("/api/pets/ranking");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("items");
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items[0]).toEqual({
      id: topPet.id,
      name: topPetName,
      type: "dog",
      imageUrl: `https://images.example/${topPetName}.png`,
      ratingsCount: 7000,
      ownerId,
      ownerDisplayName: "any_name",
      createdAt: topCreatedAt.toISOString(),
    });
    expect(
      response.body.items.some(
        (item: { name: string }) => item.name === secondPetName,
      ),
    ).toBe(true);
    expect(
      response.body.items.some(
        (item: { name: string }) => item.name === excludedPetName,
      ),
    ).toBe(false);
  });
});
