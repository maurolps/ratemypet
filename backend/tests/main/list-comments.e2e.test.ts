import type { Express } from "express";
import type { Pet } from "@domain/entities/pet";
import { describe, it, expect, beforeAll } from "vitest";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { insertComment } from "../infra/db/postgres/helpers/fake-comment";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { createPost } from "./helpers/create-post";
import { makeApp } from "@main/http/app";
import request from "supertest";

const makeSut = () => {
  const app = makeApp();
  const postRepository = new PgPostRepository();

  return {
    app,
    postRepository,
  };
};

describe("[E2E] UC-010 ListComments", () => {
  let app: Express;
  let postRepository: PgPostRepository;
  let ownerId: string;
  let pet: Pet;

  beforeAll(async () => {
    const sut = makeSut();
    app = sut.app;
    postRepository = sut.postRepository;

    const owner = await createAndLoginUser(app);
    ownerId = owner.userId;
    pet = await insertFakePet(ownerId);
  });

  it("Should return paginated comments ordered by most recent first with cursor support", async () => {
    const post = await createPost(postRepository, pet.id, ownerId);
    const firstCommentDate = new Date(0);
    const secondCommentDate = new Date(1);
    const thirdCommentDate = new Date(2);
    const firstCommentId = crypto.randomUUID();
    const secondCommentId = crypto.randomUUID();
    const thirdCommentId = crypto.randomUUID();

    await insertComment({
      id: firstCommentId,
      post_id: post.toState.id || "",
      author_id: ownerId,
      content: "older_comment",
      idempotency_key: crypto.randomUUID(),
      created_at: firstCommentDate,
    });
    await insertComment({
      id: secondCommentId,
      post_id: post.toState.id || "",
      author_id: ownerId,
      content: "middle_comment",
      idempotency_key: crypto.randomUUID(),
      created_at: secondCommentDate,
    });
    await insertComment({
      id: thirdCommentId,
      post_id: post.toState.id || "",
      author_id: ownerId,
      content: "newer_comment",
      idempotency_key: crypto.randomUUID(),
      created_at: thirdCommentDate,
    });

    const firstPageResponse = await request(app)
      .get(`/api/posts/${post.toState.id}/comments`)
      .query({ limit: 2 });

    expect(firstPageResponse.status).toBe(200);
    expect(firstPageResponse.body.items).toHaveLength(2);
    expect(firstPageResponse.body.items[0].id).toBe(thirdCommentId);
    expect(firstPageResponse.body.items[0].author_name).toBe("any_name");
    expect(firstPageResponse.body.items[1].id).toBe(secondCommentId);
    expect(firstPageResponse.body.has_more).toBe(true);
    expect(firstPageResponse.body.next_cursor).toBe(
      `${secondCommentDate.toISOString()}|${secondCommentId}`,
    );

    const secondPageResponse = await request(app)
      .get(`/api/posts/${post.toState.id}/comments`)
      .query({
        limit: 2,
        cursor: firstPageResponse.body.next_cursor,
      });

    expect(secondPageResponse.status).toBe(200);
    expect(secondPageResponse.body.items).toHaveLength(1);
    expect(secondPageResponse.body.items[0].id).toBe(firstCommentId);
    expect(secondPageResponse.body.has_more).toBe(false);
    expect(secondPageResponse.body.next_cursor).toBeNull();
  });
});
