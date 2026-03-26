import { AppError } from "@application/errors/app-error";
import { DeleteRateUseCase } from "@application/usecases/delete-rate.usecase";
import { describe, expect, it, vi } from "vitest";
import { DeleteRateRepositoryStub } from "./doubles/delete-rate.repository.stub";
import { FindPetRepositoryStub } from "./doubles/find-pet.repository.stub";

describe("DeleteRateUseCase", () => {
  const makeSut = () => {
    const findPetRepositoryStub = new FindPetRepositoryStub();
    const findPetRepositorySpy = vi.spyOn(findPetRepositoryStub, "findById");
    const deleteRateRepositoryStub = new DeleteRateRepositoryStub();
    const deleteRateRepositorySpy = vi.spyOn(
      deleteRateRepositoryStub,
      "deleteByPetIdAndUserId",
    );
    const sut = new DeleteRateUseCase(
      findPetRepositoryStub,
      deleteRateRepositoryStub,
    );

    return {
      sut,
      findPetRepositorySpy,
      deleteRateRepositorySpy,
    };
  };

  const deleteRateDTO = {
    petId: "valid_pet_id",
    userId: "valid_user_id",
  };

  it("Should call FindPetRepository.findById with correct values", async () => {
    const { sut, findPetRepositorySpy } = makeSut();

    await sut.execute(deleteRateDTO);

    expect(findPetRepositorySpy).toHaveBeenCalledWith("valid_pet_id");
  });

  it("Should throw NOT_FOUND if pet is not found", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    findPetRepositorySpy.mockResolvedValueOnce(null);

    const promise = sut.execute(deleteRateDTO);

    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified pet does not exist."),
    );
  });

  it("Should call DeleteRateRepository.deleteByPetIdAndUserId with correct values", async () => {
    const { sut, deleteRateRepositorySpy } = makeSut();

    await sut.execute(deleteRateDTO);

    expect(deleteRateRepositorySpy).toHaveBeenCalledWith(
      "valid_pet_id",
      "valid_user_id",
    );
  });

  it("Should return deleted when repository removes an existing rate", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(deleteRateDTO);

    expect(result).toEqual({
      petId: "valid_pet_id",
      status: "deleted",
    });
  });

  it("Should return unchanged when repository does not find a rate to delete", async () => {
    const { sut, deleteRateRepositorySpy } = makeSut();
    deleteRateRepositorySpy.mockResolvedValueOnce(false);

    const result = await sut.execute(deleteRateDTO);

    expect(result).toEqual({
      petId: "valid_pet_id",
      status: "unchanged",
    });
  });

  it("Should rethrow if DeleteRateRepository.deleteByPetIdAndUserId throws an unexpected error", async () => {
    const { sut, deleteRateRepositorySpy } = makeSut();
    deleteRateRepositorySpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(deleteRateDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
