import type { Express } from "express";
import type { Pet } from "@domain/entities/pet";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { PgLikeRepository } from "@infra/db/postgres/pg-like.repository";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { createPost } from "./helpers/create-post";
import { makeApp } from "@main/http/app";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import request from "supertest";

const makeSut = () => {
  const app = makeApp();
  const postRepository = new PgPostRepository();
  const likeRepository = new PgLikeRepository();

  return {
    app,
    postRepository,
    likeRepository,
  };
};

describe("[E2E] UC-006 LikePost", () => {
  let app: Express;
  let postRepository: PgPostRepository;
  let likeRepository: PgLikeRepository;
  let userId: string;
  let accessToken: string;
  let pet: Pet;

  beforeAll(async () => {
    const sut = makeSut();
    app = sut.app;
    postRepository = sut.postRepository;
    likeRepository = sut.likeRepository;

    const loggedUser = await createAndLoginUser(app);
    userId = loggedUser.userId;
    accessToken = loggedUser.accessToken;
    pet = await insertFakePet(userId);
  });

  afterAll(async () => {
    const db = PgPool.getInstance();
    await db.query("DROP TRIGGER IF EXISTS fail_on_update ON posts");
    await db.query("DROP FUNCTION IF EXISTS fail_transaction");
  });

  it("Should return status 200 when liking a post", async () => {
    const post = await createPost(postRepository, pet.id, userId);

    const response = await request(app)
      .post(`/api/posts/${post.toState.id}/likes`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.like.post_id).toEqual(post.toState.id);
    expect(response.body.like.user_id).toEqual(userId);
    expect(response.body.likes_count).toBe(1);
  });

  it("Should ensure atomicity when multiple users like a post simultaneously", async () => {
    const post = await createPost(
      postRepository,
      pet.id,
      userId,
      "Atomicity Test",
    );
    const numberOfUsers = 3;

    const loggedUsers = await Promise.all(
      Array.from({ length: numberOfUsers }).map((_) => createAndLoginUser(app)),
    );

    const responses = await Promise.all(
      loggedUsers.map((user) =>
        request(app)
          .post(`/api/posts/${post.toState.id}/likes`)
          .set("Authorization", `Bearer ${user.accessToken}`),
      ),
    );

    responses.forEach((response) => {
      expect(response.status).toBe(200);
    });

    const updatedPost = await postRepository.findById(post.toState.id || "");
    expect(updatedPost?.toState.likes_count).toBe(numberOfUsers);
  });

  it("Should rollback transaction when update fails", async () => {
    const post = await createPost(
      postRepository,
      pet.id,
      userId,
      "Rollback Test",
    );

    const db = PgPool.getInstance();
    await db.query(`
      CREATE OR REPLACE FUNCTION fail_transaction() RETURNS TRIGGER AS $$
      BEGIN
        RAISE EXCEPTION 'Forced failure for testing';
      END;
      $$ LANGUAGE plpgsql;
     `);
    await db.query(`
      CREATE TRIGGER fail_on_update
      BEFORE UPDATE ON posts
      FOR EACH ROW
      WHEN (NEW.id = '${post.toState.id}')
      EXECUTE FUNCTION fail_transaction();
     `);

    const response = await request(app)
      .post(`/api/posts/${post.toState.id}/likes`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(500);

    const likeExists = await likeRepository.exists({
      post_id: post.toState.id || "",
      user_id: userId,
    });
    expect(likeExists).toBeNull();

    await db.query("DROP TRIGGER IF EXISTS fail_on_update ON posts");
    await db.query("DROP FUNCTION IF EXISTS fail_transaction");
  });

  it("Should ensure idempotency when liking the same post at the same time", async () => {
    const post = await createPost(
      postRepository,
      pet.id,
      userId,
      "Idempotent Test",
    );

    const [firstResponse, secondResponse] = await Promise.all([
      request(app)
        .post(`/api/posts/${post.toState.id}/likes`)
        .set("Authorization", `Bearer ${accessToken}`),
      request(app)
        .post(`/api/posts/${post.toState.id}/likes`)
        .set("Authorization", `Bearer ${accessToken}`),
    ]);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    const updatedPost = await postRepository.findById(post.toState.id || "");
    expect(updatedPost?.toState.likes_count).toBe(1);
  });
});
