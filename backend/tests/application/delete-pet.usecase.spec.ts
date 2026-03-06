import type { Transaction } from "@application/ports/unit-of-work.contract";
import { AppError } from "@application/errors/app-error";
import { DeletePetUseCase } from "@application/usecases/delete-pet.usecase";
import { Post } from "@domain/entities/post";
import { describe, expect, it, vi } from "vitest";
import { DeletePostRepositoryStub } from "./doubles/delete-post.repository.stub";
import { DeletePetRepositoryStub } from "./doubles/delete-pet.repository.stub";
import { FindPetWithDeletedRepositoryStub } from "./doubles/find-pet-with-deleted.repository.stub";
import { FindPublishedPostsRepositoryStub } from "./doubles/find-published-posts.repository.stub";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";
import { FIXED_DATE } from "../config/constants";

describe("DeletePetUseCase", () => {
  const makeSut = () => {
    const findPetWithDeletedRepositoryStub =
      new FindPetWithDeletedRepositoryStub();
    const findPetWithDeletedRepositorySpy = vi.spyOn(
      findPetWithDeletedRepositoryStub,
      "findByIdIncludingDeleted",
    );
    const deletePetRepositoryStub = new DeletePetRepositoryStub();
    const deletePetRepositorySpy = vi.spyOn(
      deletePetRepositoryStub,
      "softDeleteById",
    );
    const findPublishedPostsRepositoryStub =
      new FindPublishedPostsRepositoryStub();
    const findPublishedPostsRepositorySpy = vi.spyOn(
      findPublishedPostsRepositoryStub,
      "findPublishedByPetId",
    );
    const deletePostRepositoryStub = new DeletePostRepositoryStub();
    const deletePostRepositorySpy = vi.spyOn(
      deletePostRepositoryStub,
      "deletePost",
    );
    const unitOfWorkStub = new UnitOfWorkStub();
    const sut = new DeletePetUseCase(
      findPetWithDeletedRepositoryStub,
      deletePetRepositoryStub,
      findPublishedPostsRepositoryStub,
      deletePostRepositoryStub,
      unitOfWorkStub,
    );

    return {
      sut,
      findPetWithDeletedRepositorySpy,
      deletePetRepositorySpy,
      findPublishedPostsRepositorySpy,
      deletePostRepositorySpy,
    };
  };

  const deletePetDTO = {
    pet_id: "valid_pet_id",
    user_id: "valid_owner_id",
  };

  it("Should call FindPetWithDeletedRepository.findByIdIncludingDeleted with correct values", async () => {
    const { sut, findPetWithDeletedRepositorySpy } = makeSut();
    await sut.execute(deletePetDTO);
    expect(findPetWithDeletedRepositorySpy).toHaveBeenCalledWith(
      "valid_pet_id",
      {} as Transaction,
    );
  });

  it("Should throw NOT_FOUND if pet does not exist", async () => {
    const { sut, findPetWithDeletedRepositorySpy } = makeSut();
    findPetWithDeletedRepositorySpy.mockResolvedValueOnce(null);
    const promise = sut.execute(deletePetDTO);
    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified pet does not exist."),
    );
  });

  it("Should throw FORBIDDEN if authenticated user is not the pet owner", async () => {
    const { sut, findPetWithDeletedRepositorySpy } = makeSut();
    findPetWithDeletedRepositorySpy.mockResolvedValueOnce({
      id: "valid_pet_id",
      owner_id: "different_owner_id",
      name: "valid_pet_name",
      type: "dog",
      image_url: "valid_pet_image_url",
      caption: "valid_caption",
      created_at: new Date(),
      deleted_at: null,
    });
    const promise = sut.execute(deletePetDTO);
    await expect(promise).rejects.toThrow(
      new AppError(
        "FORBIDDEN",
        "You do not have permission to delete this pet.",
      ),
    );
  });

  it("Should return void and avoid side effects when pet is already deleted", async () => {
    const {
      sut,
      findPetWithDeletedRepositorySpy,
      deletePetRepositorySpy,
      findPublishedPostsRepositorySpy,
      deletePostRepositorySpy,
    } = makeSut();
    findPetWithDeletedRepositorySpy.mockResolvedValueOnce({
      id: "valid_pet_id",
      owner_id: "valid_owner_id",
      name: "valid_pet_name",
      type: "dog",
      image_url: "valid_pet_image_url",
      caption: "valid_caption",
      created_at: new Date(),
      deleted_at: new Date(),
    });

    const result = await sut.execute(deletePetDTO);

    expect(result).toBeUndefined();
    expect(deletePetRepositorySpy).toHaveBeenCalledTimes(0);
    expect(findPublishedPostsRepositorySpy).toHaveBeenCalledTimes(0);
    expect(deletePostRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it("Should call DeletePetRepository.softDeleteById with correct values", async () => {
    const { sut, deletePetRepositorySpy } = makeSut();
    await sut.execute(deletePetDTO);
    expect(deletePetRepositorySpy).toHaveBeenCalledWith(
      "valid_pet_id",
      {} as Transaction,
    );
  });

  it("Should call FindPublishedPostsRepository.findPublishedByPetId with correct values", async () => {
    const { sut, findPublishedPostsRepositorySpy } = makeSut();
    await sut.execute(deletePetDTO);
    expect(findPublishedPostsRepositorySpy).toHaveBeenCalledWith(
      "valid_pet_id",
      {} as Transaction,
    );
  });

  it("Should call DeletePostRepository.deletePost for every published related post", async () => {
    const { sut, findPublishedPostsRepositorySpy, deletePostRepositorySpy } =
      makeSut();
    findPublishedPostsRepositorySpy.mockResolvedValueOnce([
      Post.rehydrate({
        id: "post_1",
        pet_id: "valid_pet_id",
        author_id: "valid_owner_id",
        caption: "caption_1",
        status: "PUBLISHED",
        created_at: FIXED_DATE,
        likes_count: 0,
        comments_count: 0,
      }),
      Post.rehydrate({
        id: "post_2",
        pet_id: "valid_pet_id",
        author_id: "valid_owner_id",
        caption: "caption_2",
        status: "PUBLISHED",
        created_at: FIXED_DATE,
        likes_count: 0,
        comments_count: 0,
      }),
    ]);

    await sut.execute(deletePetDTO);

    const deletedPost = deletePostRepositorySpy.mock.calls[0][0];
    expect(deletePostRepositorySpy).toHaveBeenCalledTimes(2);
    expect(deletedPost.toState.pet_id).toBe("valid_pet_id");
    expect(deletedPost.toState.status).toBe("DELETED");
  });

  it("Should return void and not call DeletePostRepository when there are no published posts", async () => {
    const { sut, findPublishedPostsRepositorySpy, deletePostRepositorySpy } =
      makeSut();
    findPublishedPostsRepositorySpy.mockResolvedValueOnce([]);

    const result = await sut.execute(deletePetDTO);

    expect(result).toBeUndefined();
    expect(deletePostRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it("Should rethrow if FindPetWithDeletedRepository throws an unexpected error", async () => {
    const { sut, findPetWithDeletedRepositorySpy } = makeSut();
    findPetWithDeletedRepositorySpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(deletePetDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
