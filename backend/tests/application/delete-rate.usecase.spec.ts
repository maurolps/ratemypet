import { AppError } from "@application/errors/app-error";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import { DeleteRateUseCase } from "@application/usecases/delete-rate.usecase";
import { describe, expect, it, vi } from "vitest";
import { DeleteRateRepositoryStub } from "./doubles/delete-rate.repository.stub";
import { FindPetRepositoryStub } from "./doubles/find-pet.repository.stub";
import { UpdatePetRatingsCountRepositoryStub } from "./doubles/update-pet-ratings-count.repository.stub";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";

describe("DeleteRateUseCase", () => {
  const makeSut = () => {
    const findPetRepositoryStub = new FindPetRepositoryStub();
    const findPetRepositorySpy = vi.spyOn(findPetRepositoryStub, "findById");
    const deleteRateRepositoryStub = new DeleteRateRepositoryStub();
    const deleteRateRepositorySpy = vi.spyOn(
      deleteRateRepositoryStub,
      "deleteByPetIdAndUserId",
    );
    const updatePetRatingsCountRepositoryStub =
      new UpdatePetRatingsCountRepositoryStub();
    const decrementRatingsCountSpy = vi.spyOn(
      updatePetRatingsCountRepositoryStub,
      "decrementRatingsCount",
    );
    const unitOfWorkStub = new UnitOfWorkStub();
    const unitOfWorkExecuteSpy = vi.spyOn(unitOfWorkStub, "execute");
    const sut = new DeleteRateUseCase(
      findPetRepositoryStub,
      deleteRateRepositoryStub,
      updatePetRatingsCountRepositoryStub,
      unitOfWorkStub,
    );

    return {
      sut,
      findPetRepositorySpy,
      deleteRateRepositorySpy,
      decrementRatingsCountSpy,
      unitOfWorkExecuteSpy,
    };
  };

  const deleteRateDTO = {
    petId: "valid_pet_id",
    userId: "valid_user_id",
  };

  it("Should run inside UnitOfWork", async () => {
    const { sut, unitOfWorkExecuteSpy } = makeSut();

    await sut.execute(deleteRateDTO);

    expect(unitOfWorkExecuteSpy).toHaveBeenCalledTimes(1);
  });

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
      {} as Transaction,
    );
  });

  it("Should decrement ratings_count and return deleted when repository removes an existing rate", async () => {
    const { sut, decrementRatingsCountSpy } = makeSut();

    const result = await sut.execute(deleteRateDTO);

    expect(result).toEqual({
      petId: "valid_pet_id",
      status: "deleted",
    });
    expect(decrementRatingsCountSpy).toHaveBeenCalledWith(
      "valid_pet_id",
      {} as Transaction,
    );
  });

  it("Should return unchanged and avoid decrement when repository does not find a rate to delete", async () => {
    const { sut, deleteRateRepositorySpy, decrementRatingsCountSpy } =
      makeSut();
    deleteRateRepositorySpy.mockResolvedValueOnce(false);

    const result = await sut.execute(deleteRateDTO);

    expect(result).toEqual({
      petId: "valid_pet_id",
      status: "unchanged",
    });
    expect(decrementRatingsCountSpy).not.toHaveBeenCalled();
  });

  it("Should rethrow if DeleteRateRepository.deleteByPetIdAndUserId throws an unexpected error", async () => {
    const { sut, deleteRateRepositorySpy } = makeSut();
    deleteRateRepositorySpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(deleteRateDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });

  it("Should rethrow if decrement ratings count throws an unexpected error", async () => {
    const { sut, decrementRatingsCountSpy } = makeSut();
    decrementRatingsCountSpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(deleteRateDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
