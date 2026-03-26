import { AppError } from "@application/errors/app-error";
import { RatePetUseCase } from "@application/usecases/rate-pet.usecase";
import { describe, expect, it, vi } from "vitest";
import { FindPetRepositoryStub } from "./doubles/find-pet.repository.stub";
import { RateRepositoryStub } from "./doubles/rate.repository.stub";

describe("RatePetUseCase", () => {
  const makeSut = () => {
    const findPetRepositoryStub = new FindPetRepositoryStub();
    const findPetRepositorySpy = vi.spyOn(findPetRepositoryStub, "findById");
    const rateRepositoryStub = new RateRepositoryStub();
    const rateRepositoryUpsertSpy = vi.spyOn(rateRepositoryStub, "upsert");
    const sut = new RatePetUseCase(findPetRepositoryStub, rateRepositoryStub);

    return {
      sut,
      findPetRepositorySpy,
      rateRepositoryUpsertSpy,
    };
  };

  const ratePetDTO = {
    petId: "valid_pet_id",
    userId: "valid_user_id",
    rate: "majestic" as const,
  };

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

    expect(rateRepositoryUpsertSpy).toHaveBeenCalledWith({
      petId: "valid_pet_id",
      userId: "valid_user_id",
      rate: "majestic",
    });
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
