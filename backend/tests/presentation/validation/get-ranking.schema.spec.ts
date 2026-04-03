import type { GetRankingDTO } from "@domain/usecases/get-ranking.contract";
import { AppError } from "@application/errors/app-error";
import { getRankingSchema } from "@presentation/validation/get-ranking.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator GetRanking", () => {
  const sut = new ZodHttpValidator<GetRankingDTO>(getRankingSchema);

  const dummyRequest = {
    query: {
      type: "dog",
    },
  };

  it("Should return a GetRankingDTO when validating a valid request", () => {
    const result = sut.execute(dummyRequest);

    expect(result).toEqual({
      type: "dog",
    });
  });

  it("Should return a GetRankingDTO when validating a valid cat request", () => {
    const result = sut.execute({
      query: {
        type: "cat",
      },
    });

    expect(result).toEqual({
      type: "cat",
    });
  });

  it("Should allow missing type", () => {
    const result = sut.execute({
      query: {},
    });

    expect(result).toEqual({
      type: undefined,
    });
  });

  it("Should allow missing query", () => {
    const result = sut.execute({
      query: undefined,
    });

    expect(result).toEqual({
      type: undefined,
    });
  });

  it("Should throw an AppError if query.type is invalid", () => {
    const request = {
      query: {
        type: "bird",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "type"),
    );
  });
});
