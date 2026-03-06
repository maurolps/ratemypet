import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { DeletePostUseCase } from "@application/usecases/delete-post.usecase";
import { FindPostRepositoryStub } from "./doubles/find-post.repository.stub";
import { DeletePostRepositoryStub } from "./doubles/delete-post.repository.stub";
import { Post, type PostStatus } from "@domain/entities/post";
import { FIXED_DATE } from "../config/constants";

describe("DeletePostUseCase", () => {
  const makeFakePost = (
    author_id = "valid_author_id",
    status: PostStatus = "PUBLISHED",
  ) =>
    Post.rehydrate({
      id: "valid_post_id",
      pet_id: "valid_pet_id",
      author_id,
      caption: "valid_caption",
      status,
      created_at: FIXED_DATE,
      likes_count: 0,
      comments_count: 0,
    });

  const makeSut = () => {
    const findPostRepositoryStub = new FindPostRepositoryStub();
    const deletePostRepositoryStub = new DeletePostRepositoryStub();
    const findPostRepositorySpy = vi.spyOn(findPostRepositoryStub, "findById");
    const deletePostRepositorySpy = vi.spyOn(
      deletePostRepositoryStub,
      "deletePost",
    );
    const sut = new DeletePostUseCase(
      findPostRepositoryStub,
      deletePostRepositoryStub,
    );

    return {
      sut,
      findPostRepositorySpy,
      deletePostRepositorySpy,
    };
  };

  const deletePostDTO = {
    post_id: "valid_post_id",
    user_id: "valid_author_id",
  };

  it("Should call FindPostRepository.findById with correct values", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    await sut.execute(deletePostDTO);
    expect(findPostRepositorySpy).toHaveBeenCalledWith("valid_post_id");
  });

  it("Should throw NOT_FOUND if post does not exist", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(null);
    const promise = sut.execute(deletePostDTO);
    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified post does not exist."),
    );
  });

  it("Should throw FORBIDDEN if authenticated user is not the post author", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(
      makeFakePost("different_author_id"),
    );
    const promise = sut.execute(deletePostDTO);
    await expect(promise).rejects.toThrow(
      new AppError(
        "FORBIDDEN",
        "You do not have permission to delete this post.",
      ),
    );
  });

  it("Should not call DeletePostRepository.deletePost when post is already DELETED", async () => {
    const { sut, findPostRepositorySpy, deletePostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(
      makeFakePost("valid_author_id", "DELETED"),
    );

    await sut.execute(deletePostDTO);

    expect(deletePostRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it("Should call DeletePostRepository.deletePost with correct value", async () => {
    const { sut, deletePostRepositorySpy } = makeSut();
    await sut.execute(deletePostDTO);

    const deletedPost = deletePostRepositorySpy.mock.calls[0][0];
    expect(deletedPost.toState.id).toBe("valid_post_id");
    expect(deletedPost.toState.author_id).toBe("valid_author_id");
    expect(deletedPost.toState.status).toBe("DELETED");
  });

  it("Should return void on success", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(deletePostDTO);
    expect(result).toBeUndefined();
  });

  it("Should rethrow if FindPostRepository throws an unexpected error", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockRejectedValueOnce(new Error("Unexpected error"));

    const promise = sut.execute(deletePostDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });

  it("Should rethrow if DeletePostRepository throws an unexpected error", async () => {
    const { sut, deletePostRepositorySpy } = makeSut();
    deletePostRepositorySpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(deletePostDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
