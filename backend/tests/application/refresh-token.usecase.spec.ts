import { describe, expect, it, vi } from "vitest";
import { RefreshTokenRepositoryStub } from "./doubles/refresh-token.repository.stub";
import { RefreshTokenUseCase } from "@application/usecases/refresh-token.usecase";
import { AppError } from "@application/errors/app-error";

describe("RefreshTokenUseCase", () => {
  const makeSut = () => {
    const refreshTokenRepositoryStub = new RefreshTokenRepositoryStub();
    const findTokenByIdSpy = vi.spyOn(refreshTokenRepositoryStub, "findById");
    const sut = new RefreshTokenUseCase(refreshTokenRepositoryStub);
    return {
      sut,
      findTokenByIdSpy,
    };
  };

  it("Should call RefreshTokenRepository.findById with correct values", async () => {
    const { sut, findTokenByIdSpy } = makeSut();
    const dummyToken = {
      id: "refresh_token_id",
      secret: "refresh_token_secret",
    };
    await sut.execute(dummyToken);
    expect(findTokenByIdSpy).toHaveBeenCalledWith("refresh_token_id");
  });

  it("Should throw UNAUTHORIZED when token is not found", async () => {
    const { sut, findTokenByIdSpy } = makeSut();
    findTokenByIdSpy.mockResolvedValueOnce(null);
    const dummyToken = {
      id: "non_existing_token_id",
      secret: "any_secret",
    };
    const promise = sut.execute(dummyToken);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });
});
