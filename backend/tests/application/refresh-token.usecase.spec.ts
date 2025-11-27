import { describe, expect, it, vi } from "vitest";
import { RefreshTokenUseCase } from "@application/usecases/refresh-token.usecase";
import { TokenIssuerServiceStub } from "./doubles/token-issuer.service.stub";

describe("RefreshTokenUseCase", () => {
  const makeSut = () => {
    const tokenIssuerStub = new TokenIssuerServiceStub();
    const tokenIssuerValidateSpy = vi.spyOn(
      tokenIssuerStub,
      "validateRefreshToken",
    );
    const sut = new RefreshTokenUseCase(tokenIssuerStub);
    return {
      sut,
      tokenIssuerValidateSpy,
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
});
