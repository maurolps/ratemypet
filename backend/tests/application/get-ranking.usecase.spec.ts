import { GetRankingUseCase } from "@application/usecases/get-ranking.usecase";
import { describe, expect, it, vi } from "vitest";
import { FIXED_DATE } from "../config/constants";
import { GetRankingQueryStub } from "./doubles/get-ranking.query.stub";

describe("GetRankingUseCase", () => {
  const makeSut = () => {
    const getRankingQueryStub = new GetRankingQueryStub();
    const getRankingQuerySpy = vi.spyOn(getRankingQueryStub, "getRanking");
    const sut = new GetRankingUseCase(getRankingQueryStub);

    return {
      sut,
      getRankingQuerySpy,
    };
  };

  it("Should call GetRankingQuery.getRanking with correct values", async () => {
    const { sut, getRankingQuerySpy } = makeSut();

    await sut.execute({
      type: "dog",
    });

    expect(getRankingQuerySpy).toHaveBeenCalledWith({
      type: "dog",
    });
  });

  it("Should delegate undefined type when filter is missing", async () => {
    const { sut, getRankingQuerySpy } = makeSut();

    await sut.execute({});

    expect(getRankingQuerySpy).toHaveBeenCalledWith({
      type: undefined,
    });
  });

  it("Should preserve returned ranking items unchanged", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      type: "dog",
    });

    expect(result).toEqual({
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

  it("Should rethrow if GetRankingQuery throws an unexpected error", async () => {
    const { sut, getRankingQuerySpy } = makeSut();
    getRankingQuerySpy.mockRejectedValueOnce(new Error("Unexpected error"));

    const promise = sut.execute({
      type: "dog",
    });

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
