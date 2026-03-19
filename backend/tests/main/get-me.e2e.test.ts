import type { Express } from "express";
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { makeApp } from "@main/http/app";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { Post } from "@domain/entities/post";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";

const makeSut = () => {
  const app = makeApp();
  const pool = PgPool.getInstance();
  const postRepository = new PgPostRepository();

  return {
    app,
    pool,
    postRepository,
  };
};

describe("[E2E] UC-016 Get Me", () => {
  let app: Express;
  let pool: PgPool;
  let postRepository: PgPostRepository;

  beforeAll(async () => {
    const sut = makeSut();
    app = sut.app;
    pool = sut.pool;
    postRepository = sut.postRepository;
  });

  it("Should return 200 with profile data, published-only stats, and pets", async () => {
    const user = await createAndLoginUser(app);
    const pet = await insertFakePet(user.userId);

    const publishedPost = await postRepository.save(
      Post.rehydrate({
        pet_id: pet.id,
        author_id: user.userId,
        caption: "Published caption",
        status: "PUBLISHED",
        created_at: new Date(),
        likes_count: 7,
        comments_count: 0,
      }),
    );
    await pool.query(
      `
      UPDATE posts
      SET likes_count = 7
      WHERE id = $1
      `,
      [publishedPost.toState.id],
    );
    const rejectedPost = await postRepository.save(
      Post.rehydrate({
        pet_id: pet.id,
        author_id: user.userId,
        caption: "Rejected caption",
        status: "REJECTED",
        created_at: new Date(),
        likes_count: 15,
        comments_count: 0,
      }),
    );
    await pool.query(
      `
      UPDATE posts
      SET likes_count = 15
      WHERE id = $1
      `,
      [rejectedPost.toState.id],
    );

    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(user.userId);
    expect(response.body.displayName).toBe("any_name");
    expect(response.body.email).toContain("@example.com");
    expect(response.body.bio).toBeTruthy();
    expect(new Date(response.body.createdAt).toString()).not.toBe(
      "Invalid Date",
    );
    expect(response.body.picture).toBeNull();
    expect(response.body.stats).toEqual({
      postsCount: 1,
      likesReceived: 7,
    });
    expect(response.body.pets).toEqual([
      {
        id: pet.id,
        name: "fake_pet_name",
        type: "dog",
        imageUrl: "https://fake.image.url/pet.png",
      },
    ]);
  });
});
