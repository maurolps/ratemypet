import type { Express } from "express";
import type { Pet } from "@domain/entities/pet";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { PgCreateCommentRepository } from "@infra/db/postgres/pg-create-comment.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";
import { createAndLoginUser } from "./helpers/create-and-login-user";
import { createPost } from "./helpers/create-post";
import { makeApp } from "@main/http/app";
import request from "supertest";

const FAIL_FUNCTION_NAME = "fail_comment_delete_transaction";
const FAIL_TRIGGER_NAME = "fail_comment_delete_on_update";

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

describe("[E2E] UC-013 DeleteComment", () => {
  let app: Express;
  let postRepository: PgPostRepository;
  let commentRepository: PgCreateCommentRepository;
  let postAuthorId: string;
  let commentAuthorAccessToken: string;
  let pet: Pet;

  const createComment = async (
    postId: string,
    accessToken: string,
    content = "A valid comment",
  ) => {
    const response = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("idempotency-key", crypto.randomUUID())
      .send({ content });

    return response;
  };

  beforeAll(async () => {
    const sut = makeSut();
    app = sut.app;
    postRepository = sut.postRepository;
    commentRepository = sut.commentRepository;

    const postAuthor = await createAndLoginUser(app);
    postAuthorId = postAuthor.userId;

    const commentAuthor = await createAndLoginUser(app);
    commentAuthorAccessToken = commentAuthor.accessToken;

    pet = await insertFakePet(postAuthorId);
  });

  afterAll(async () => {
    const db = PgPool.getInstance();
    await db.query(`DROP TRIGGER IF EXISTS ${FAIL_TRIGGER_NAME} ON posts`);
    await db.query(`DROP FUNCTION IF EXISTS ${FAIL_FUNCTION_NAME}`);
  });

  it("Should rollback transaction when post comments_count update fails", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const post = await createPost(postRepository, pet.id, postAuthorId);
    const createCommentResponse = await createComment(
      post.toState.id || "",
      commentAuthorAccessToken,
      "rollback delete",
    );
    const commentId = createCommentResponse.body.comment.id as string;

    try {
      const db = PgPool.getInstance();
      await db.query(`
      CREATE OR REPLACE FUNCTION ${FAIL_FUNCTION_NAME}() RETURNS TRIGGER AS $$
      BEGIN
        RAISE EXCEPTION 'DeleteComment: Forced failure for testing';
      END;
      $$ LANGUAGE plpgsql;
    `);
      await db.query(`
      CREATE TRIGGER ${FAIL_TRIGGER_NAME}
      BEFORE UPDATE ON posts
      FOR EACH ROW
      WHEN (NEW.id = '${post.toState.id}')
      EXECUTE FUNCTION ${FAIL_FUNCTION_NAME}();
    `);

      const response = await request(app)
        .delete(`/api/posts/${post.toState.id}/comments/${commentId}`)
        .set("Authorization", `Bearer ${commentAuthorAccessToken}`);

      expect(response.status).toBe(500);

      const existingComment = await commentRepository.findByIdAndPostId(
        commentId,
        post.toState.id || "",
      );
      expect(existingComment).not.toBeNull();

      await db.query(`DROP TRIGGER IF EXISTS ${FAIL_TRIGGER_NAME} ON posts`);
      await db.query(`DROP FUNCTION IF EXISTS ${FAIL_FUNCTION_NAME}`);
    } finally {
      consoleLogSpy.mockRestore();
    }
  });
});
