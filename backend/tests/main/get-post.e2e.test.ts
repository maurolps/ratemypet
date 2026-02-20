import type { Express } from "express";
import type { Pet } from "@domain/entities/pet";
import { describe, it, expect, beforeAll } from "vitest";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { makeApp } from "@main/http/app";
import { Post } from "@domain/entities/post";
import request from "supertest";

const makeSut = () => {
  const app = makeApp();
  const postRepository = new PgPostRepository();

  return {
    app,
    postRepository,
  };
};

const createPost = async (
  postRepository: PgPostRepository,
  petId: string,
  authorId: string,
  caption = "A valid caption",
) => {
  return postRepository.save(
    Post.create({
      pet_id: petId,
      author_id: authorId,
      default_caption: "A default caption",
      caption,
    }),
  );
};

describe("[E2E] UC-009 GetPost", () => {
  let app: Express;
  let postRepository: PgPostRepository;
  let ownerId: string;
  let viewerAccessToken: string;
  let pet: Pet;

  beforeAll(async () => {
    const sut = makeSut();
    app = sut.app;
    postRepository = sut.postRepository;

    const owner = await createAndLoginUser(app);
    ownerId = owner.userId;
    pet = await insertFakePet(ownerId);

    const viewer = await createAndLoginUser(app);
    viewerAccessToken = viewer.accessToken;
  });

  it("Should return status 200 and viewer_has_liked false when auth is not provided", async () => {
    const post = await createPost(
      postRepository,
      pet.id,
      ownerId,
      "GetPost caption",
    );

    const response = await request(app).get(`/api/posts/${post.toState.id}`);

    expect(response.status).toBe(200);
    expect(response.body.post.id).toBe(post.toState.id);
    expect(response.body.post.author_id).toBe(ownerId);
    expect(response.body.post.caption).toBe("GetPost caption");
    expect(response.body.post.viewer_has_liked).toBe(false);
    expect(response.body.comments).toEqual([]);
    expect(response.body.pagination).toEqual({
      limit: 20,
      next_cursor: null,
      has_more: false,
    });
  });

  it("Should return status 200 and viewer_has_liked true when authenticated viewer has liked the post", async () => {
    const post = await createPost(
      postRepository,
      pet.id,
      ownerId,
      "Liked post",
    );
    await request(app)
      .post(`/api/posts/${post.toState.id}/likes`)
      .set("Authorization", `Bearer ${viewerAccessToken}`);

    const response = await request(app)
      .get(`/api/posts/${post.toState.id}`)
      .set("Authorization", `Bearer ${viewerAccessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.post.id).toBe(post.toState.id);
    expect(response.body.post.viewer_has_liked).toBe(true);
    expect(response.body.post.likes_count).toBe(1);
  });

  it("Should return status 401 when Authorization token is invalid", async () => {
    const post = await createPost(
      postRepository,
      pet.id,
      ownerId,
      "Invalid token",
    );

    const response = await request(app)
      .get(`/api/posts/${post.toState.id}`)
      .set("Authorization", "Bearer invalid_token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});
