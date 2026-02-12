import type { Express } from "express";
import type { Pet } from "@domain/entities/pet";
import { describe, it, expect, beforeAll } from "vitest";
import { PgCreateCommentRepository } from "@infra/db/postgres/pg-create-comment.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { makeApp } from "@main/http/app";
import { Post } from "@domain/entities/post";
import request from "supertest";

const makeSut = () => {
  const app = makeApp();
  const postRepository = new PgPostRepository();
  const commentRepository = new PgCreateCommentRepository();

  return {
    app,
    postRepository,
    commentRepository,
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

describe("[E2E] UC-008 CreateComment", () => {
  let app: Express;
  let postRepository: PgPostRepository;
  let commentRepository: PgCreateCommentRepository;
  let userId: string;
  let accessToken: string;
  let pet: Pet;

  beforeAll(async () => {
    const sut = makeSut();
    app = sut.app;
    postRepository = sut.postRepository;
    commentRepository = sut.commentRepository;

    const loggedUser = await createAndLoginUser(app);
    userId = loggedUser.userId;
    accessToken = loggedUser.accessToken;
    pet = await insertFakePet(userId);
  });

  it("Should return status 200 when creating a comment", async () => {
    const post = await createPost(postRepository, pet.id, userId);
    const idempotencyKey = crypto.randomUUID();
    const content = "A valid comment";

    const response = await request(app)
      .post(`/api/posts/${post.toState.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("idempotency-key", idempotencyKey)
      .send({ content });

    expect(response.status).toBe(200);
    expect(response.body.comment.id).toBeTruthy();
    expect(response.body.comment.post_id).toEqual(post.toState.id);
    expect(response.body.comment.author_id).toEqual(userId);
    expect(response.body.comment.content).toEqual(content);
    expect(response.body.comment.idempotency_key).toEqual(idempotencyKey);
    expect(response.body.comments_count).toBe(1);

    const savedComment = await commentRepository.findByIdempotencyKey({
      post_id: post.toState.id || "",
      author_id: userId,
      idempotency_key: idempotencyKey,
    });
    expect(savedComment?.content).toEqual(content);
  });

  it("Should ensure idempotency when creating the same comment at the same time", async () => {
    const post = await createPost(postRepository, pet.id, userId);
    const idempotencyKey = crypto.randomUUID();
    const content = "Idempotency test comment";

    const [firstResponse, secondResponse] = await Promise.all([
      request(app)
        .post(`/api/posts/${post.toState.id}/comments`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("idempotency-key", idempotencyKey)
        .send({ content }),
      request(app)
        .post(`/api/posts/${post.toState.id}/comments`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("idempotency-key", idempotencyKey)
        .send({ content }),
    ]);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(firstResponse.body.comment.id).toEqual(
      secondResponse.body.comment.id,
    );
    expect(firstResponse.body.comments_count).toBe(1);
    expect(secondResponse.body.comments_count).toBe(1);

    const updatedPost = await postRepository.findById(post.toState.id || "");
    expect(updatedPost?.toState.comments_count).toBe(1);
  });

  it("Should return status 400 when idempotency key header is missing", async () => {
    const post = await createPost(postRepository, pet.id, userId);

    const response = await request(app)
      .post(`/api/posts/${post.toState.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "A valid comment" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Missing Param");
  });
});
