import type { Express } from "express";
import { makeApp } from "@main/http/app";
import { PgRateRepository } from "@infra/db/postgres/pg-rate.repository";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("[E2E] UC-020 DeleteRate", () => {
  let app: Express;
  let sut: PgRateRepository;
  let ownerId: string;
  let raterId: string;
  let accessToken: string;

  beforeAll(async () => {
    app = makeApp();
    sut = new PgRateRepository();

    const owner = await createAndLoginUser(app);
    ownerId = owner.userId;

    const rater = await createAndLoginUser(app);
    raterId = rater.userId;
    accessToken = rater.accessToken;
  });

  it("Should return 200 with deleted when removing an existing rate", async () => {
    const pet = await insertFakePet(ownerId);
    await sut.upsert({
      petId: pet.id,
      userId: raterId,
      rate: "cute",
    });

    const response = await request(app)
      .delete(`/api/pets/${pet.id}/rate`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      petId: pet.id,
      status: "deleted",
    });

    const storedRate = await sut.findByPetIdAndUserId(pet.id, raterId);
    expect(storedRate).toBeNull();
  });

  it("Should return 200 with unchanged when deleting the same rate twice", async () => {
    const pet = await insertFakePet(ownerId);
    await sut.upsert({
      petId: pet.id,
      userId: raterId,
      rate: "smart",
    });

    const firstResponse = await request(app)
      .delete(`/api/pets/${pet.id}/rate`)
      .set("Authorization", `Bearer ${accessToken}`);

    const secondResponse = await request(app)
      .delete(`/api/pets/${pet.id}/rate`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toEqual({
      petId: pet.id,
      status: "deleted",
    });
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body).toEqual({
      petId: pet.id,
      status: "unchanged",
    });
  });

  it("Should return 200 with unchanged when the user has not rated the pet", async () => {
    const pet = await insertFakePet(ownerId);

    const response = await request(app)
      .delete(`/api/pets/${pet.id}/rate`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      petId: pet.id,
      status: "unchanged",
    });
  });

  it("Should return 400 when pet id is invalid", async () => {
    const response = await request(app)
      .delete("/api/pets/invalid_pet_id/rate")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Param: id");
  });

  it("Should return 401 when Authorization token is invalid", async () => {
    const pet = await insertFakePet(ownerId);

    const response = await request(app)
      .delete(`/api/pets/${pet.id}/rate`)
      .set("Authorization", "Bearer invalid_token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("Should return 404 when pet does not exist", async () => {
    const response = await request(app)
      .delete(`/api/pets/${crypto.randomUUID()}/rate`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "Not Found: The specified pet does not exist.",
    );
  });

  it("Should keep the delete idempotent under concurrent requests", async () => {
    const pet = await insertFakePet(ownerId);
    await sut.upsert({
      petId: pet.id,
      userId: raterId,
      rate: "funny",
    });

    const [firstResponse, secondResponse] = await Promise.all([
      request(app)
        .delete(`/api/pets/${pet.id}/rate`)
        .set("Authorization", `Bearer ${accessToken}`),
      request(app)
        .delete(`/api/pets/${pet.id}/rate`)
        .set("Authorization", `Bearer ${accessToken}`),
    ]);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    const statuses = [
      firstResponse.body.status,
      secondResponse.body.status,
    ].sort();

    expect(statuses).toEqual(["deleted", "unchanged"]);

    const storedRate = await sut.findByPetIdAndUserId(pet.id, raterId);
    expect(storedRate).toBeNull();
  });
});
