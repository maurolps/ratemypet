import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { GetRankingController } from "@presentation/controllers/get-ranking.controller";
import { FIXED_DATE } from "../config/constants";
import { GetRankingUseCaseStub } from "./doubles/get-ranking.usecase.stub";
import { GetRankingValidatorStub } from "./doubles/get-ranking.validator.stub";

describe("GetRankingController", () => {
  const makeSut = () => {
    const httpValidatorStub = new GetRankingValidatorStub();
    const getRankingUseCaseStub = new GetRankingUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const getRankingUseCaseSpy = vi.spyOn(getRankingUseCaseStub, "execute");
    const sut = new GetRankingController(
      httpValidatorStub,
      getRankingUseCaseStub,
    );

    return { sut, httpValidatorSpy, getRankingUseCaseSpy };
  };

  const dummyRequest = {
    query: {
      type: "dog",
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call GetRanking use case with correct values", async () => {
    const { sut, getRankingUseCaseSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(getRankingUseCaseSpy).toHaveBeenCalledWith({
      type: "dog",
    });
  });

  it("Should return 200 with ranking data on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      items: [
        {
          id: "valid_pet_id",
          name: "valid_pet_name",
          type: "dog",
          imageUrl: "https://valid.image/pet.png",
          ratingsCount: 7,
          ownerId: "valid_owner_id",
          ownerDisplayName: "valid_owner_display_name",
          createdAt: FIXED_DATE,
        },
      ],
    });
  });

  it("Should return 400 if HttpValidator returns an INVALID_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("INVALID_PARAM", "type");
    });

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body).toMatchObject({
      message: "Invalid Param: type",
    });
  });

  it("Should rethrow if HttpValidator throws an unexpected error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new Error("unexpected_error");
    });

    await expect(sut.handle(dummyRequest)).rejects.toThrow(Error);
  });
});
