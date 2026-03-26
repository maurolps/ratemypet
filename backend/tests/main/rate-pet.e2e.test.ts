import type { Express } from "express";
import { makeApp } from "@main/http/app";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { PgRateRepository } from "@infra/db/postgres/pg-rate.repository";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

const makeSut = () => {
  const app = makeApp();
  const rateRepository = new PgRateRepository();

  return {
    app,
    rateRepository,
  };
};

describe("[E2E] UC-019 RatePet", () => {
  let app: Express;
  let rateRepository: PgRateRepository;
  let ownerId: string;
  let raterId: string;
  let accessToken: string;

  beforeAll(async () => {
    const sut = makeSut();
    app = sut.app;
    rateRepository = sut.rateRepository;

    const owner = await createAndLoginUser(app);
    ownerId = owner.userId;

    const rater = await createAndLoginUser(app);
    raterId = rater.userId;
    accessToken = rater.accessToken;
  });

  it("Should return 200 when creating a pet rate", async () => {
    const pet = await insertFakePet(ownerId);

    const response = await request(app)
      .post(`/api/pets/${pet.id}/rate`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ rate: "cute" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      petId: pet.id,
      rate: "cute",
    });
  });

  it("Should remain idempotent when rating the same pet with the same value", async () => {
    const pet = await insertFakePet(ownerId);

    const [firstResponse, secondResponse] = await Promise.all([
      request(app)
        .post(`/api/pets/${pet.id}/rate`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ rate: "sleepy" }),
      request(app)
        .post(`/api/pets/${pet.id}/rate`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ rate: "sleepy" }),
    ]);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    const storedRate = await rateRepository.findByPetIdAndUserId(
      pet.id,
      raterId,
    );
    const db = PgPool.getInstance();
    const countRows = await db.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM ratings
        WHERE pet_id = $1 AND user_id = $2
      `,
      [pet.id, raterId],
    );

    expect(storedRate?.rate).toBe("sleepy");
    expect(Number(countRows.rows[0].count)).toBe(1);
  });

  it("Should update the existing rate when a different value is sent", async () => {
    const pet = await insertFakePet(ownerId);

    const createResponse = await request(app)
      .post(`/api/pets/${pet.id}/rate`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ rate: "funny" });

    const updateResponse = await request(app)
      .post(`/api/pets/${pet.id}/rate`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ rate: "smart" });

    expect(createResponse.status).toBe(200);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      petId: pet.id,
      rate: "smart",
    });

    const storedRate = await rateRepository.findByPetIdAndUserId(
      pet.id,
      raterId,
    );

    expect(storedRate?.rate).toBe("smart");
  });
});
