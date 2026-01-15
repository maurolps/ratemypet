import { CreatePostUseCase } from "@application/usecases/create-post.usecase";
import { describe, vi, it, expect } from "vitest";
import { FindPetRepositoryStub } from "./doubles/find-pet.repository.stub";
import { AppError } from "@application/errors/app-error";

describe("CreatePostUseCase", () => {
  const makeSut = () => {
    const findPetRepositoryStub = new FindPetRepositoryStub();
    const findPetRepositorySpy = vi.spyOn(findPetRepositoryStub, "findById");
    const sut = new CreatePostUseCase(findPetRepositoryStub);
    return {
      sut,
      findPetRepositorySpy,
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

  it("Should return 403 if pet does not belong to the author", async () => {
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
});
