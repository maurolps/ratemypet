import { describe, expect, it, vi } from "vitest";
import { UnlikePostUseCase } from "@application/usecases/unlike-post.usecase";
import { FindPostRepositoryStub } from "./doubles/find-post.repository.stub";
import { LikeRepositoryStub } from "./doubles/like.repository.stub";
import { UpdateLikesRepositoryStub } from "./doubles/update-like.repository.stub";
import { AppError } from "@application/errors/app-error";
import { FIXED_DATE } from "../config/constants";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import { Post } from "@domain/entities/post";

const makeLikeRepositoryDoubles = () => {
  const likeRepositoryStub = new LikeRepositoryStub();
  const likeRepositoryExistsSpy = vi.spyOn(likeRepositoryStub, "exists");
  const likeRepositoryDeleteSpy = vi.spyOn(likeRepositoryStub, "delete");
  likeRepositoryExistsSpy.mockResolvedValue({
    post_id: "valid_post_id",
    user_id: "authenticated_user_id",
    created_at: FIXED_DATE,
  });
  return {
    likeRepositoryExistsSpy,
    likeRepositoryDeleteSpy,
    likeRepositoryStub,
  };
};

describe("UnlikePostUseCase", () => {
  const postState = {
    id: "valid_post_id",
    pet_id: "valid_pet_id",
    author_id: "valid_author_id",
    caption: "valid_caption",
    created_at: FIXED_DATE,
    comments_count: 0,
  };

  const makeFakePostState = (likes_count: number) =>
    Post.rehydrate({
      ...postState,
      status: "PUBLISHED",
      likes_count,
    });

  const makeSut = () => {
    const {
      likeRepositoryExistsSpy,
      likeRepositoryDeleteSpy,
      likeRepositoryStub,
    } = makeLikeRepositoryDoubles();
    const findPostRepositoryStub = new FindPostRepositoryStub();
    const findPostRepositorySpy = vi.spyOn(findPostRepositoryStub, "findById");
    const updateLikesRepositoryStub = new UpdateLikesRepositoryStub();
    const decrementLikesRepositorySpy = vi.spyOn(
      updateLikesRepositoryStub,
      "decrementLikesCount",
    );
    const unitOfWorkStub = new UnitOfWorkStub();
    const sut = new UnlikePostUseCase(
      findPostRepositoryStub,
      likeRepositoryStub,
      updateLikesRepositoryStub,
      unitOfWorkStub,
    );
    return {
      sut,
      findPostRepositorySpy,
      likeRepositoryDeleteSpy,
      likeRepositoryExistsSpy,
      decrementLikesRepositorySpy,
    };
  };

  const unlikePostDTO = {
    post_id: "valid_post_id",
    user_id: "authenticated_user_id",
  };

  it("Should call FindPostRepository.findById with correct value", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    await sut.execute(unlikePostDTO);
    expect(findPostRepositorySpy).toHaveBeenCalledWith(
      "valid_post_id",
      {} as Transaction,
    );
  });

  it("Should throw NOT_FOUND if post does not exist", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(null);
    const promise = sut.execute(unlikePostDTO);
    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified post does not exist."),
    );
  });

  it("Should call LikeRepository.exists with correct values", async () => {
    const { sut, likeRepositoryExistsSpy } = makeSut();
    await sut.execute(unlikePostDTO);
    expect(likeRepositoryExistsSpy).toHaveBeenCalledWith(
      {
        post_id: "valid_post_id",
        user_id: "authenticated_user_id",
      },
      {} as Transaction,
    );
  });

  it("Should return current likes_count and avoid delete when post is not liked", async () => {
    const {
      sut,
      likeRepositoryExistsSpy,
      likeRepositoryDeleteSpy,
      decrementLikesRepositorySpy,
      findPostRepositorySpy,
    } = makeSut();
    likeRepositoryExistsSpy.mockResolvedValueOnce(null);
    findPostRepositorySpy.mockResolvedValueOnce(makeFakePostState(10));
    const result = await sut.execute(unlikePostDTO);
    expect(result).toEqual({
      post_id: "valid_post_id",
      likes_count: 10,
    });
    expect(likeRepositoryDeleteSpy).toHaveBeenCalledTimes(0);
    expect(decrementLikesRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it("Should call LikeRepository.delete with correct values when like exists", async () => {
    const { sut, likeRepositoryDeleteSpy } = makeSut();
    await sut.execute(unlikePostDTO);
    expect(likeRepositoryDeleteSpy).toHaveBeenCalledWith(
      {
        post_id: "valid_post_id",
        user_id: "authenticated_user_id",
      },
      {} as Transaction,
    );
  });

  it("Should call UpdateLikesRepository.decrementLikesCount with decremented likes_count", async () => {
    const { sut, findPostRepositorySpy, decrementLikesRepositorySpy } =
      makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(makeFakePostState(5));
    await sut.execute(unlikePostDTO);
    const updatedPost = decrementLikesRepositorySpy.mock.calls[0][0];
    expect(updatedPost.toState.likes_count).toBe(4);
  });

  it("Should not decrement likes_count below zero", async () => {
    const { sut, findPostRepositorySpy, decrementLikesRepositorySpy } =
      makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(makeFakePostState(0));
    await sut.execute(unlikePostDTO);
    const updatedPost = decrementLikesRepositorySpy.mock.calls[0][0];
    expect(updatedPost.toState.likes_count).toBe(0);
  });

  it("Should reThrow if LikeRepository throws an unexpected error", async () => {
    const { sut, likeRepositoryExistsSpy } = makeSut();
    likeRepositoryExistsSpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );
    const promise = sut.execute(unlikePostDTO);
    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });

  it("Should return UnlikePostResult on success", async () => {
    const { sut, findPostRepositorySpy } = makeSut();
    findPostRepositorySpy.mockResolvedValueOnce(makeFakePostState(10));
    const result = await sut.execute(unlikePostDTO);
    expect(result).toEqual({
      post_id: "valid_post_id",
      likes_count: 9,
    });
  });
});
