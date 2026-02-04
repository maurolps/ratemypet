import { describe, expect, it, vi } from "vitest";
import { LikePostUseCase } from "@application/usecases/like-post.usecase";
import { FindPostRepositoryStub } from "./doubles/find-post.repository.stub";
import { LikeRepositoryStub } from "./doubles/like.repository.stub";
import { UpdateLikesRepositoryStub } from "./doubles/update-like.repository.stub";
import { AppError } from "@application/errors/app-error";
import { FIXED_DATE } from "../config/constants";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";
import type { Transaction } from "@application/ports/unit-of-work.contract";

describe("LikePostUseCase", () => {
  const makeSut = () => {
    const findPostRepositoryStub = new FindPostRepositoryStub();
    const findPostRepositorySpy = vi.spyOn(findPostRepositoryStub, "findById");
    const likeRepositoryStub = new LikeRepositoryStub();
    const likeRepositoryExistsSpy = vi.spyOn(likeRepositoryStub, "exists");
    const likeRepositorySaveSpy = vi.spyOn(likeRepositoryStub, "save");
    const updateLikesRepositoryStub = new UpdateLikesRepositoryStub();
    const updateLikesRepositorySpy = vi.spyOn(
      updateLikesRepositoryStub,
      "updateLikesCount",
    );
    const unitOfWorkStub = new UnitOfWorkStub();
    const sut = new LikePostUseCase(
      findPostRepositoryStub,
      likeRepositoryStub,
      updateLikesRepositoryStub,
      unitOfWorkStub,
    );
    return {
      sut,
      findPostRepositorySpy,
      likeRepositoryExistsSpy,
      likeRepositorySaveSpy,
      updateLikesRepositorySpy,
    };
  };

  const likePostDTO = {
    post_id: "valid_post_id",
    user_id: "valid_user_id",
  };

  it("Should call FindPostRepository.findById with correct value", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    await sut.execute(likePostDTO);
    expect(findPostRepositorySpy).toHaveBeenCalledWith(
      "valid_post_id",
      {} as Transaction,
    );
  });

  it("Should throw NOT_FOUND if post is not found", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(null);
    const promise = sut.execute(likePostDTO);
    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified post does not exist."),
    );
  });

  it("Should call LikeRepository.exists with correct values", async () => {
    const { sut, likeRepositoryExistsSpy } = makeSut();
    await sut.execute(likePostDTO);
    expect(likeRepositoryExistsSpy).toHaveBeenCalledWith(
      {
        post_id: "valid_post_id",
        user_id: "valid_user_id",
      },
      {} as Transaction,
    );
  });

  it("Should return existing like and avoid updates when already liked", async () => {
    const {
      sut,
      likeRepositoryExistsSpy,
      likeRepositorySaveSpy,
      updateLikesRepositorySpy,
    } = makeSut();
    likeRepositoryExistsSpy.mockResolvedValueOnce({
      post_id: "valid_post_id",
      user_id: "valid_user_id",
      created_at: FIXED_DATE,
    });
    const result = await sut.execute(likePostDTO);
    expect(result).toEqual({
      like: {
        post_id: "valid_post_id",
        user_id: "valid_user_id",
        created_at: FIXED_DATE,
      },
      likes_count: 0,
    });
    expect(likeRepositorySaveSpy).toHaveBeenCalledTimes(0);
    expect(updateLikesRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it("Should call LikeRepository.save with correct values", async () => {
    const { sut, likeRepositorySaveSpy } = makeSut();
    await sut.execute(likePostDTO);
    expect(likeRepositorySaveSpy).toHaveBeenCalledWith(
      {
        post_id: "valid_post_id",
        user_id: "valid_user_id",
      },
      {} as Transaction,
    );
  });

  it("Should call UpdateLikesRepository.updateLikesCount with incremented likes_count", async () => {
    const { sut, updateLikesRepositorySpy } = makeSut();
    await sut.execute(likePostDTO);
    const updatedPost = updateLikesRepositorySpy.mock.calls[0][0];
    expect(updatedPost.toState.likes_count).toBe(1);
  });

  it("Should reThrow if LikeRepository throws an unexpected error", async () => {
    const { sut, likeRepositorySaveSpy } = makeSut();
    likeRepositorySaveSpy.mockRejectedValueOnce(new Error("Unexpected error"));
    const promise = sut.execute(likePostDTO);
    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });

  it("Should return LikePostResult on success", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(likePostDTO);
    expect(result).toEqual({
      like: {
        post_id: "valid_post_id",
        user_id: "valid_user_id",
        created_at: FIXED_DATE,
      },
      likes_count: 1,
    });
  });
});
