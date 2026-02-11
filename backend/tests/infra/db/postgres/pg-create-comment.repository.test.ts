import { beforeAll, describe, expect, it, vi } from "vitest";
import { CustomError } from "@application/errors/custom-error";
import { Post } from "@domain/entities/post";
import { PgCreateCommentRepository } from "@infra/db/postgres/pg-create-comment.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { insertFakePet } from "./helpers/fake-pet";
import { insertFakeUser } from "./helpers/fake-user";

describe("PgCreateCommentRepository", () => {
  const commentDTO = {
    post_id: "",
    author_id: "",
    content: "valid comment content",
    idempotency_key: crypto.randomUUID(),
  };

  beforeAll(async () => {
    const user = await insertFakeUser(
      `fake_comment_owner_${Date.now()}@mail.com`,
    );
    const pet = await insertFakePet(user.id);
    const postRepository = new PgPostRepository();
    const post = await postRepository.save(
      Post.create({
        pet_id: pet.id,
        author_id: user.id,
        default_caption: "Fake caption",
        caption: "Fake caption",
      }),
    );

    commentDTO.author_id = user.id;
    commentDTO.post_id = post.toState.id ?? "";
  });

  it("Should persist and return a Comment on success", async () => {
    const sut = new PgCreateCommentRepository();
    const comment = await sut.save(commentDTO);

    expect(comment.id).toBeTruthy();
    expect(comment.post_id).toEqual(commentDTO.post_id);
    expect(comment.author_id).toEqual(commentDTO.author_id);
    expect(comment.content).toEqual(commentDTO.content);
    expect(comment.idempotency_key).toEqual(commentDTO.idempotency_key);
    expect(comment.created_at).toBeInstanceOf(Date);
  });

  it("Should return a Comment when it exists by idempotency key", async () => {
    const sut = new PgCreateCommentRepository();
    const comment = await sut.findByIdempotencyKey({
      post_id: commentDTO.post_id,
      author_id: commentDTO.author_id,
      idempotency_key: commentDTO.idempotency_key,
    });

    expect(comment).not.toBeNull();
    expect(comment?.post_id).toEqual(commentDTO.post_id);
    expect(comment?.author_id).toEqual(commentDTO.author_id);
    expect(comment?.content).toEqual(commentDTO.content);
    expect(comment?.idempotency_key).toEqual(commentDTO.idempotency_key);
  });

  it("Should return null when comment does not exist by idempotency key", async () => {
    const sut = new PgCreateCommentRepository();
    const comment = await sut.findByIdempotencyKey({
      post_id: crypto.randomUUID(),
      author_id: crypto.randomUUID(),
      idempotency_key: crypto.randomUUID(),
    });

    expect(comment).toBeNull();
  });

  it("Should throw CustomError when saving duplicate idempotency key", async () => {
    const sut = new PgCreateCommentRepository();
    const duplicatedCommentDTO = {
      ...commentDTO,
      content: "different content but same idempotency key",
    };
    const promise = sut.save(duplicatedCommentDTO);

    await expect(promise).rejects.toBeInstanceOf(CustomError);
    await expect(promise).rejects.toMatchObject({
      code: "UNIQUE_VIOLATION",
    });
  });

  it("Should use a transaction when saving a comment", async () => {
    const sut = new PgCreateCommentRepository();
    const transaction = {
      query: vi.fn().mockResolvedValue({
        rows: [
          {
            id: "valid_comment_id",
            post_id: commentDTO.post_id,
            author_id: commentDTO.author_id,
            content: commentDTO.content,
            idempotency_key: commentDTO.idempotency_key,
            created_at: new Date(),
          },
        ],
      }),
    };

    await sut.save(commentDTO, transaction);

    expect(transaction.query).toHaveBeenCalled();
  });

  it("Should use a transaction when finding a comment by idempotency key", async () => {
    const sut = new PgCreateCommentRepository();
    const transaction = {
      query: vi.fn().mockResolvedValue({
        rows: [
          {
            id: "valid_comment_id",
            post_id: commentDTO.post_id,
            author_id: commentDTO.author_id,
            content: commentDTO.content,
            idempotency_key: commentDTO.idempotency_key,
            created_at: new Date(),
          },
        ],
      }),
    };

    await sut.findByIdempotencyKey(
      {
        post_id: commentDTO.post_id,
        author_id: commentDTO.author_id,
        idempotency_key: commentDTO.idempotency_key,
      },
      transaction,
    );

    expect(transaction.query).toHaveBeenCalled();
  });
});
