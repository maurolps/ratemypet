import type { Express } from "express";
import type { Pet } from "@domain/entities/pet";
import { describe, it, expect, beforeAll } from "vitest";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { createPost } from "./helpers/create-post";
import { makeApp } from "@main/http/app";
import request from "supertest";

const makeSut = () => {
  const app = makeApp();
  const petRepository = new PgPetRepository();
  const postRepository = new PgPostRepository();

  return {
    app,
    petRepository,
    postRepository,
  };
};

describe("[E2E] UC-014 DeletePet", () => {
  let app: Express;
  let petRepository: PgPetRepository;
  let postRepository: PgPostRepository;
  let ownerId: string;
  let ownerAccessToken: string;
  let pet: Pet;

  beforeAll(async () => {
    const sut = makeSut();
    app = sut.app;
    petRepository = sut.petRepository;
    postRepository = sut.postRepository;

    const owner = await createAndLoginUser(app);
    ownerId = owner.userId;
    ownerAccessToken = owner.accessToken;

    pet = await insertFakePet(ownerId);
  });

  it("Should return 204 and soft delete pet while cascading related posts status to DELETED", async () => {
    const post1 = await createPost(
      postRepository,
      pet.id,
      ownerId,
      "caption_1",
    );
    const post2 = await createPost(
      postRepository,
      pet.id,
      ownerId,
      "caption_2",
    );

    const response = await request(app)
      .delete(`/api/pets/${pet.id}`)
      .set("Authorization", `Bearer ${ownerAccessToken}`);

    expect(response.status).toBe(204);

    const activePet = await petRepository.findById(pet.id);
    expect(activePet).toBeNull();

    const deletedPet = await petRepository.findByIdIncludingDeleted(pet.id);
    expect(deletedPet?.deleted_at).toBeTruthy();

    const deletedPost1 = await postRepository.findById(post1.toState.id || "");
    const deletedPost2 = await postRepository.findById(post2.toState.id || "");

    expect(deletedPost1?.toState.status).toBe("DELETED");
    expect(deletedPost2?.toState.status).toBe("DELETED");
  });
});
