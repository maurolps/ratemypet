import { CreatePostUseCase } from "@application/usecases/create-post.usecase";
import { describe, vi, it, expect } from "vitest";
import { FindPetRepositoryStub } from "./doubles/find-pet.repository.stub";

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
    author_id: "valid_author_id",
    caption: "valid_caption",
  };

  it("Should call FindPetRepository.findById with correct value", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    await sut.execute(postDTO);
    expect(findPetRepositorySpy).toHaveBeenCalledWith("valid_pet_id");
  });
});
