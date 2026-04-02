import { AppError } from "@application/errors/app-error";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import { RatePetUseCase } from "@application/usecases/rate-pet.usecase";
import { describe, expect, it, vi } from "vitest";
import { FindPetRepositoryStub } from "./doubles/find-pet.repository.stub";
import { RateRepositoryStub } from "./doubles/rate.repository.stub";
import { UpdatePetRatingsCountRepositoryStub } from "./doubles/update-pet-ratings-count.repository.stub";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";
import { FIXED_DATE } from "../config/constants";

describe("RatePetUseCase", () => {
  const makeSut = () => {
    const findPetRepositoryStub = new FindPetRepositoryStub();
    const findPetRepositorySpy = vi.spyOn(findPetRepositoryStub, "findById");
    const rateRepositoryStub = new RateRepositoryStub();
    const rateRepositoryUpsertSpy = vi.spyOn(rateRepositoryStub, "upsert");
    const updatePetRatingsCountRepositoryStub =
      new UpdatePetRatingsCountRepositoryStub();
    const updatePetRatingsCountRepositorySpy = vi.spyOn(
      updatePetRatingsCountRepositoryStub,
      "incrementRatingsCount",
    );
    const unitOfWorkStub = new UnitOfWorkStub();
    const unitOfWorkExecuteSpy = vi.spyOn(unitOfWorkStub, "execute");
    const sut = new RatePetUseCase(
      findPetRepositoryStub,
      rateRepositoryStub,
      updatePetRatingsCountRepositoryStub,
      unitOfWorkStub,
    );

    return {
      sut,
      findPetRepositorySpy,
      rateRepositoryUpsertSpy,
      updatePetRatingsCountRepositorySpy,
      unitOfWorkExecuteSpy,
    };
  };

  const ratePetDTO = {
    petId: "valid_pet_id",
    userId: "valid_user_id",
    rate: "majestic" as const,
  };

  it("Should run inside UnitOfWork", async () => {
    const { sut, unitOfWorkExecuteSpy } = makeSut();

    await sut.execute(ratePetDTO);

    expect(unitOfWorkExecuteSpy).toHaveBeenCalledTimes(1);
  });

  it("Should call FindPetRepository.findById with correct values", async () => {
    const { sut, findPetRepositorySpy } = makeSut();

    await sut.execute(ratePetDTO);

    expect(findPetRepositorySpy).toHaveBeenCalledWith("valid_pet_id");
  });

  it("Should throw NOT_FOUND if pet is not found", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    findPetRepositorySpy.mockResolvedValueOnce(null);

    const promise = sut.execute(ratePetDTO);

    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified pet does not exist."),
    );
  });

  it("Should call RateRepository.upsert with correct values", async () => {
    const { sut, rateRepositoryUpsertSpy } = makeSut();

    await sut.execute(ratePetDTO);

    expect(rateRepositoryUpsertSpy).toHaveBeenCalledWith(
      {
        petId: "valid_pet_id",
        userId: "valid_user_id",
        rate: "majestic",
      },
      {} as Transaction,
    );
  });

  it("Should increment ratings_count when upsert creates a new rate", async () => {
    const { sut, updatePetRatingsCountRepositorySpy } = makeSut();

    await sut.execute(ratePetDTO);

    expect(updatePetRatingsCountRepositorySpy).toHaveBeenCalledWith(
      "valid_pet_id",
      {} as Transaction,
    );
  });

  it("Should not increment ratings_count when upsert updates an existing rate", async () => {
    const { sut, rateRepositoryUpsertSpy, updatePetRatingsCountRepositorySpy } =
      makeSut();
    rateRepositoryUpsertSpy.mockResolvedValueOnce({
      rate: {
        petId: "valid_pet_id",
        userId: "valid_user_id",
        rate: "majestic",
        createdAt: FIXED_DATE,
        updatedAt: FIXED_DATE,
      },
      wasCreated: false,
    });

    const result = await sut.execute(ratePetDTO);

    expect(result).toEqual({
      petId: "valid_pet_id",
      rate: "majestic",
    });
    expect(updatePetRatingsCountRepositorySpy).not.toHaveBeenCalled();
  });

  it("Should not increment ratings_count when upsert returns unchanged", async () => {
    const { sut, rateRepositoryUpsertSpy, updatePetRatingsCountRepositorySpy } =
      makeSut();
    rateRepositoryUpsertSpy.mockResolvedValueOnce({
      rate: {
        petId: "valid_pet_id",
        userId: "valid_user_id",
        rate: "majestic",
        createdAt: FIXED_DATE,
        updatedAt: FIXED_DATE,
      },
      wasCreated: false,
    });

    const result = await sut.execute(ratePetDTO);

    expect(result).toEqual({
      petId: "valid_pet_id",
      rate: "majestic",
    });
    expect(updatePetRatingsCountRepositorySpy).not.toHaveBeenCalled();
  });

  it("Should return RatePetResult on success", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(ratePetDTO);

    expect(result).toEqual({
      petId: "valid_pet_id",
      rate: "majestic",
    });
  });

  it("Should rethrow if RateRepository.upsert throws an unexpected error", async () => {
    const { sut, rateRepositoryUpsertSpy } = makeSut();
    rateRepositoryUpsertSpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(ratePetDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
