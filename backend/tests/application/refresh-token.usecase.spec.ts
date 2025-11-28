import { describe, expect, it, vi } from "vitest";
import { RefreshTokenUseCase } from "@application/usecases/refresh-token.usecase";
import { TokenIssuerServiceStub } from "./doubles/token-issuer.service.stub";
import { FindUserRepositoryStub } from "./doubles/find-user.repository.stub";
import { AppError } from "@application/errors/app-error";
import { RefreshTokenRepositoryStub } from "./doubles/refresh-token.repository.stub";

describe("RefreshTokenUseCase", () => {
  const makeSut = () => {
    const tokenIssuerStub = new TokenIssuerServiceStub();
    const findUserStub = new FindUserRepositoryStub();
    const refreshTokenRepositoryStub = new RefreshTokenRepositoryStub();

    const findUserSpy = vi.spyOn(findUserStub, "findById");
    const tokenIssuerValidateSpy = vi.spyOn(
      tokenIssuerStub,
      "validateRefreshToken",
    );
    const tokenIssuerSpy = vi.spyOn(tokenIssuerStub, "execute");
    const refreshTokenRevokeSpy = vi.spyOn(
      refreshTokenRepositoryStub,
      "revoke",
    );

    const sut = new RefreshTokenUseCase(
      tokenIssuerStub,
      findUserStub,
      refreshTokenRepositoryStub,
    );

    return {
      sut,
      tokenIssuerValidateSpy,
      findUserSpy,
      tokenIssuerSpy,
      findUserStub,
      refreshTokenRevokeSpy,
    };
  };

  const validDummyToken = {
    id: "refresh_token_id",
    secret: "refresh_token_secret",
  };

  it("Should call TokenIssuer.validateRefreshToken with correct values", async () => {
    const { sut, tokenIssuerValidateSpy } = makeSut();
    await sut.execute(validDummyToken);
    expect(tokenIssuerValidateSpy).toHaveBeenCalledWith(validDummyToken);
  });

  it("Should throw if TokenIssuer.validateRefreshToken throws", async () => {
    const { sut, tokenIssuerValidateSpy } = makeSut();
    tokenIssuerValidateSpy.mockImplementationOnce(() => {
      throw new Error("Error");
    });
    const promise = sut.execute(validDummyToken);
    await expect(promise).rejects.toThrow();
  });

  it("Should call FindUserRepository.findById with correct values", async () => {
    const { sut, findUserSpy } = makeSut();
    await sut.execute(validDummyToken);
    expect(findUserSpy).toHaveBeenCalledWith("valid_user_id");
  });

  it("Should throw UNAUTHORIZED if user does not exist", async () => {
    const { sut, findUserSpy } = makeSut();
    findUserSpy.mockResolvedValueOnce(null);
    const promise = sut.execute(validDummyToken);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });

  it("Should call TokenIssuer.execute with correct values", async () => {
    const { sut, tokenIssuerSpy, findUserStub } = makeSut();
    const user = await findUserStub.findById("valid_user_id");
    await sut.execute(validDummyToken);
    expect(tokenIssuerSpy).toHaveBeenCalledWith(user);
  });

  it("Should call RefreshTokenRepository.revoke with correct values", async () => {
    const { sut, refreshTokenRevokeSpy } = makeSut();
    await sut.execute(validDummyToken);
    expect(refreshTokenRevokeSpy).toHaveBeenCalledWith("refresh_token_id");
  });
});
