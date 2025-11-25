import { RefreshTokenController } from "@presentation/controllers/refresh-token.controller";
import { RefreshTokenValidatorStub } from "./doubles/refresh-token.validator.stub";
import { describe, expect, it, vi } from "vitest";

describe("RefreshTokenController", () => {
  const makeSut = () => {
    const refreshTokenValidatorStub = new RefreshTokenValidatorStub();
    const refreshTokenValidatorSpy = vi.spyOn(
      refreshTokenValidatorStub,
      "execute",
    );
    const sut = new RefreshTokenController(refreshTokenValidatorStub);
    return { sut, refreshTokenValidatorSpy };
  };

  it("Should return 200 on successful token refresh", async () => {
    const { sut } = makeSut();
    const dummyRequest = {};
    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
  });

  it("Should call HttpValidator with correct values", async () => {
    const { sut, refreshTokenValidatorSpy } = makeSut();
    const dummyRequest = {
      cookies: {
        refreshToken: "valid_id.valid_secret",
      },
    };
    await sut.handle(dummyRequest);
    expect(refreshTokenValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });
});
