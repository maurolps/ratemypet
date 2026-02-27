import type { Transaction } from "@application/ports/unit-of-work.contract";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { DeleteCommentUseCase } from "@application/usecases/delete-comment.usecase";
import { FindPostRepositoryStub } from "./doubles/find-post.repository.stub";
import { FindCommentRepositoryStub } from "./doubles/find-comment.repository.stub";
import { DeleteCommentRepositoryStub } from "./doubles/delete-comment.repository.stub";
import { UpdateCommentsRepositoryStub } from "./doubles/update-comments.repository.stub";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";
import { FIXED_DATE } from "../config/constants";
import { Post } from "@domain/entities/post";

describe("DeleteCommentUseCase", () => {
  const postState = {
    id: "valid_post_id",
    pet_id: "valid_pet_id",
    author_id: "valid_post_author_id",
    caption: "valid_caption",
    status: "PUBLISHED" as const,
    created_at: FIXED_DATE,
    likes_count: 0,
    comments_count: 1,
  };

  const makeFakePostState = (comments_count: number, author_id?: string) =>
    Post.rehydrate({
      ...postState,
      comments_count,
      author_id: author_id ?? postState.author_id,
    });

  const makeSut = () => {
    const findPostRepositoryStub = new FindPostRepositoryStub();
    const findPostRepositorySpy = vi.spyOn(findPostRepositoryStub, "findById");
    const findCommentRepositoryStub = new FindCommentRepositoryStub();
    const findCommentRepositorySpy = vi.spyOn(
      findCommentRepositoryStub,
      "findByIdAndPostId",
    );
    const deleteCommentRepositoryStub = new DeleteCommentRepositoryStub();
    const deleteCommentRepositorySpy = vi.spyOn(
      deleteCommentRepositoryStub,
      "delete",
    );
    const updateCommentsRepositoryStub = new UpdateCommentsRepositoryStub();
    const decrementCommentsRepositorySpy = vi.spyOn(
      updateCommentsRepositoryStub,
      "decrementCommentsCount",
    );
    const unitOfWorkStub = new UnitOfWorkStub();
    const sut = new DeleteCommentUseCase(
      findPostRepositoryStub,
      findCommentRepositoryStub,
      deleteCommentRepositoryStub,
      updateCommentsRepositoryStub,
      unitOfWorkStub,
    );

    return {
      sut,
      findPostRepositorySpy,
      findCommentRepositorySpy,
      deleteCommentRepositorySpy,
      decrementCommentsRepositorySpy,
    };
  };

  const deleteCommentDTO = {
    post_id: "valid_post_id",
    comment_id: "valid_comment_id",
    user_id: "valid_comment_author_id",
  };

  it("Should call FindPostRepository.findById with correct values", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    await sut.execute(deleteCommentDTO);
    expect(findPostRepositorySpy).toHaveBeenCalledWith(
      "valid_post_id",
      {} as Transaction,
    );
  });

  it("Should throw NOT_FOUND when post does not exist", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(null);
    const promise = sut.execute(deleteCommentDTO);
    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified post does not exist."),
    );
  });

  it("Should call FindCommentRepository.findByIdAndPostId with correct values", async () => {
    const { sut, findCommentRepositorySpy } = makeSut();
    await sut.execute(deleteCommentDTO);
    expect(findCommentRepositorySpy).toHaveBeenCalledWith(
      "valid_comment_id",
      "valid_post_id",
      {} as Transaction,
    );
  });

  it("Should return void and avoid side effects when comment does not exist", async () => {
    const {
      sut,
      findCommentRepositorySpy,
      deleteCommentRepositorySpy,
      decrementCommentsRepositorySpy,
    } = makeSut();
    findCommentRepositorySpy.mockResolvedValueOnce(null);

    const result = await sut.execute(deleteCommentDTO);

    expect(result).toBeUndefined();
    expect(deleteCommentRepositorySpy).toHaveBeenCalledTimes(0);
    expect(decrementCommentsRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it("Should throw FORBIDDEN when authenticated user is neither post or comment author", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({
      ...deleteCommentDTO,
      user_id: "another_user_id",
    });
    await expect(promise).rejects.toThrow(
      new AppError(
        "FORBIDDEN",
        "You do not have permission to delete this comment.",
      ),
    );
  });

  it("Should allow deletion when authenticated user is the post author", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      ...deleteCommentDTO,
      user_id: "valid_author_id",
    });
    expect(result).toBeUndefined();
  });

  it("Should call DeleteCommentRepository.delete with correct values", async () => {
    const { sut, deleteCommentRepositorySpy } = makeSut();
    await sut.execute(deleteCommentDTO);
    expect(deleteCommentRepositorySpy).toHaveBeenCalledWith(
      {
        id: "valid_comment_id",
        post_id: "valid_post_id",
      },
      {} as Transaction,
    );
  });

  it("Should not decrement comments_count when delete operation affects no rows", async () => {
    const { sut, deleteCommentRepositorySpy, decrementCommentsRepositorySpy } =
      makeSut();
    deleteCommentRepositorySpy.mockResolvedValueOnce(false);

    await sut.execute(deleteCommentDTO);

    expect(decrementCommentsRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it("Should call UpdateCommentsRepository.decrementCommentsCount with decremented comments_count", async () => {
    const { sut, findPostRepositorySpy, decrementCommentsRepositorySpy } =
      makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(makeFakePostState(5));

    await sut.execute(deleteCommentDTO);

    const updatedPost = decrementCommentsRepositorySpy.mock.calls[0][0];
    expect(updatedPost.toState.comments_count).toBe(4);
  });

  it("Should not decrement comments_count below zero", async () => {
    const { sut, findPostRepositorySpy, decrementCommentsRepositorySpy } =
      makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(makeFakePostState(0));

    await sut.execute(deleteCommentDTO);

    const updatedPost = decrementCommentsRepositorySpy.mock.calls[0][0];
    expect(updatedPost.toState.comments_count).toBe(0);
  });

  it("Should rethrow if FindCommentRepository throws an unexpected error", async () => {
    const { sut, findCommentRepositorySpy } = makeSut();
    findCommentRepositorySpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(deleteCommentDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
