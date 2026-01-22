import { CreatePostUseCase } from "@application/usecases/create-post.usecase";
import { describe, vi, it, expect } from "vitest";
import { FindPetRepositoryStub } from "./doubles/find-pet.repository.stub";
import { AppError } from "@application/errors/app-error";
import { ContentModerationStub } from "./doubles/content-moderation.stub";

describe("CreatePostUseCase", () => {
  const makeSut = () => {
    const findPetRepositoryStub = new FindPetRepositoryStub();
    const findPetRepositorySpy = vi.spyOn(findPetRepositoryStub, "findById");
    const contentModerationStub = new ContentModerationStub();
    const contentModerationSpy = vi.spyOn(contentModerationStub, "execute");
    const sut = new CreatePostUseCase(
      findPetRepositoryStub,
      contentModerationStub,
    );
    return {
      sut,
      findPetRepositorySpy,
      contentModerationSpy,
    };
  };

  const postDTO = {
    pet_id: "valid_pet_id",
    author_id: "valid_owner_id",
    caption: "valid_caption",
  };

  it("Should call FindPetRepository.findById with correct value", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    await sut.execute(postDTO);
    expect(findPetRepositorySpy).toHaveBeenCalledWith("valid_pet_id");
  });

  it("Should throw FORBIDDEN if pet does not belong to the author", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    findPetRepositorySpy.mockResolvedValueOnce({
      id: "valid_pet_id",
      owner_id: "different_owner_id",
      name: "valid_pet_name",
      type: "dog",
      image_url: "valid_pet_image_url",
      caption: "valid_caption",
      created_at: new Date(),
    });
    await expect(sut.execute(postDTO)).rejects.toThrow(
      new AppError(
        "FORBIDDEN",
        "You do not have permission to create a post for this pet.",
      ),
    );
  });

  it("Should throw NOT_FOUND if pet is not found", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    findPetRepositorySpy.mockResolvedValueOnce(null);
    const promise = sut.execute(postDTO);
    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified pet does not exist."),
    );
  });

  it("Should throw UNPROCESSABLE_ENTITY if caption has inappropriate content", async () => {
    const { sut, contentModerationSpy } = makeSut();
    contentModerationSpy.mockResolvedValueOnce({
      isAllowed: false,
      reason: "PROFANITY",
    });
    const promise = sut.execute(postDTO);
    await expect(promise).rejects.toThrow(
      new AppError(
        "UNPROCESSABLE_ENTITY",
        "Caption has inappropriate content.",
      ),
    );
  });
});
