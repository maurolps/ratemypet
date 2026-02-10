import type { Post } from "@domain/entities/post";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { CustomError } from "@application/errors/custom-error";
import { CreateCommentUseCase } from "@application/usecases/create-comment.usecase";
import { FIXED_DATE } from "../config/constants";
import { FindPostRepositoryStub } from "./doubles/find-post.repository.stub";
import { CommentRepositoryStub } from "./doubles/comment.repository.stub";
import { UpdateCommentsRepositoryStub } from "./doubles/update-comments.repository.stub";
import { ContentModerationStub } from "./doubles/content-moderation.stub";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";

describe("CreateCommentUseCase", () => {
  const makeSut = () => {
    const findPostRepositoryStub = new FindPostRepositoryStub();
    const findPostRepositorySpy = vi.spyOn(findPostRepositoryStub, "findById");
    const commentRepositoryStub = new CommentRepositoryStub();
    const commentFindByIdempotencyKeySpy = vi.spyOn(
      commentRepositoryStub,
      "findByIdempotencyKey",
    );
    const commentSaveSpy = vi.spyOn(commentRepositoryStub, "save");
    const updateCommentsRepositoryStub = new UpdateCommentsRepositoryStub();
    const updateCommentsRepositorySpy = vi.spyOn(
      updateCommentsRepositoryStub,
      "incrementCommentsCount",
    );
    const contentModerationStub = new ContentModerationStub();
    const contentModerationSpy = vi.spyOn(contentModerationStub, "execute");
    const unitOfWorkStub = new UnitOfWorkStub();
    const sut = new CreateCommentUseCase(
      findPostRepositoryStub,
      commentRepositoryStub,
      updateCommentsRepositoryStub,
      contentModerationStub,
      unitOfWorkStub,
    );

    return {
      sut,
      findPostRepositorySpy,
      commentFindByIdempotencyKeySpy,
      commentSaveSpy,
      updateCommentsRepositorySpy,
      contentModerationSpy,
    };
  };

  const createCommentDTO = {
    post_id: "valid_post_id",
    author_id: "valid_user_id",
    content: "valid_comment_content",
    idempotency_key: "valid_idempotency_key",
  };

  const fakeComment = {
    id: "valid_comment_id",
    post_id: "valid_post_id",
    author_id: "valid_user_id",
    content: "valid_comment_content",
    idempotency_key: "valid_idempotency_key",
    created_at: FIXED_DATE,
  };

  it("Should call FindPostRepository.findById with correct values", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    await sut.execute(createCommentDTO);

    expect(findPostRepositorySpy).toHaveBeenCalledWith(
      "valid_post_id",
      {} as Transaction,
    );
  });

  it("Should throw NOT_FOUND when post does not exist", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(null);

    const promise = sut.execute(createCommentDTO);

    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified post does not exist."),
    );
  });

  it("Should call CommentRepository.findByIdempotencyKey with correct values", async () => {
    const { sut, commentFindByIdempotencyKeySpy } = makeSut();
    await sut.execute(createCommentDTO);

    expect(commentFindByIdempotencyKeySpy).toHaveBeenCalledWith(
      {
        post_id: "valid_post_id",
        author_id: "valid_user_id",
        idempotency_key: "valid_idempotency_key",
      },
      {} as Transaction,
    );
  });

  it("Should return existing comment and avoid create flow when idempotent replay has same payload", async () => {
    const {
      sut,
      commentFindByIdempotencyKeySpy,
      contentModerationSpy,
      commentSaveSpy,
      updateCommentsRepositorySpy,
    } = makeSut();
    commentFindByIdempotencyKeySpy.mockResolvedValueOnce({
      ...createCommentDTO,
      id: "valid_comment_id",
      created_at: FIXED_DATE,
    });

    const result = await sut.execute(createCommentDTO);

    expect(result).toEqual({
      comment: fakeComment,
      comments_count: 0,
    });
    expect(contentModerationSpy).toHaveBeenCalledTimes(0);
    expect(commentSaveSpy).toHaveBeenCalledTimes(0);
    expect(updateCommentsRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it("Should throw INVALID_PARAM when idempotency key is reused with a different payload", async () => {
    const { sut, commentFindByIdempotencyKeySpy } = makeSut();
    commentFindByIdempotencyKeySpy.mockResolvedValueOnce({
      ...fakeComment,
      content: "different_content",
    });

    const promise = sut.execute(createCommentDTO);

    await expect(promise).rejects.toThrow(
      new AppError(
        "INVALID_PARAM",
        "Idempotency key already used with a different payload.",
      ),
    );
  });

  it("Should call ContentModeration with comment content", async () => {
    const { sut, contentModerationSpy } = makeSut();
    await sut.execute(createCommentDTO);

    expect(contentModerationSpy).toHaveBeenCalledWith("valid_comment_content");
  });

  it("Should throw UNPROCESSABLE_ENTITY when content moderation blocks the comment", async () => {
    const { sut, contentModerationSpy } = makeSut();
    contentModerationSpy.mockResolvedValueOnce({
      isAllowed: false,
      reason: "PROFANITY",
    });

    const promise = sut.execute(createCommentDTO);

    await expect(promise).rejects.toThrow(
      new AppError(
        "UNPROCESSABLE_ENTITY",
        "Comment has inappropriate content.",
      ),
    );
  });

  it("Should call CommentRepository.save with correct values", async () => {
    const { sut, commentSaveSpy } = makeSut();
    await sut.execute(createCommentDTO);

    expect(commentSaveSpy).toHaveBeenCalledWith(
      {
        post_id: "valid_post_id",
        author_id: "valid_user_id",
        content: "valid_comment_content",
        idempotency_key: "valid_idempotency_key",
      },
      {} as Transaction,
    );
  });

  it("Should call UpdateCommentsRepository.incrementCommentsCount with incremented comments_count", async () => {
    const { sut, updateCommentsRepositorySpy } = makeSut();
    await sut.execute(createCommentDTO);

    const updatedPost = updateCommentsRepositorySpy.mock.calls[0][0];
    expect(updatedPost.toState.comments_count).toBe(1);
  });

  it("Should return existing comment when unique violation happens with same payload", async () => {
    const { sut, commentSaveSpy, commentFindByIdempotencyKeySpy } = makeSut();
    commentSaveSpy.mockRejectedValueOnce(
      new CustomError("UNIQUE_VIOLATION", "already exists"),
    );
    commentFindByIdempotencyKeySpy
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(fakeComment);

    const result = await sut.execute(createCommentDTO);

    expect(result).toEqual({
      comment: fakeComment,
      comments_count: 0,
    });
  });

  it("Should throw INVALID_PARAM when unique violation happens and duplicate payload differs", async () => {
    const { sut, commentSaveSpy, commentFindByIdempotencyKeySpy } = makeSut();
    commentSaveSpy.mockRejectedValueOnce(
      new CustomError("UNIQUE_VIOLATION", "already exists"),
    );
    commentFindByIdempotencyKeySpy
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        ...fakeComment,
        content: "different_content",
      });

    const promise = sut.execute(createCommentDTO);

    await expect(promise).rejects.toThrow(
      new AppError(
        "INVALID_PARAM",
        "Idempotency key already used with a different payload.",
      ),
    );
  });

  it("Should rethrow if CommentRepository.save throws an unexpected error", async () => {
    const { sut, commentSaveSpy } = makeSut();
    commentSaveSpy.mockRejectedValueOnce(new Error("Unexpected error"));

    const promise = sut.execute(createCommentDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });

  it("Should return CreateCommentResult on success", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(createCommentDTO);

    expect(result).toEqual({
      comment: fakeComment,
      comments_count: 1,
    });
  });

  it("Should rethrow if ContentModeration throws an unexpected error", async () => {
    const { sut, contentModerationSpy } = makeSut();
    contentModerationSpy.mockRejectedValueOnce(new Error("Unexpected error"));

    const promise = sut.execute(createCommentDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });

  it("Should call UpdateCommentsRepository with a post containing the expected id", async () => {
    const { sut, updateCommentsRepositorySpy } = makeSut();
    await sut.execute(createCommentDTO);

    const updatedPost = updateCommentsRepositorySpy.mock.calls[0][0] as Post;
    expect(updatedPost.toState.id).toBe("valid_post_id");
  });
});
