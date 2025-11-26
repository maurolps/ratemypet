import { describe, expect, it, vi } from "vitest";
import { RefreshTokenRepositoryStub } from "./doubles/refresh-token.repository.stub";
import { RefreshTokenUseCase } from "@application/usecases/refresh-token.usecase";

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
});
