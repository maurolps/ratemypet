import { RefreshTokenController } from "@presentation/controllers/refresh-token.controller";
import { RefreshTokenValidatorStub } from "./doubles/refresh-token.validator.stub";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";

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

  it("Should return 400 if refresh token is missing", async () => {
    const { sut, refreshTokenValidatorSpy } = makeSut();
    const dummyRequest = {
      cookies: {},
    };
    refreshTokenValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("MISSING_PARAM", "refresh token");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Missing Param: refresh token");
  });

  it("Should return 401 if refresh token is invalid", async () => {
    const { sut, refreshTokenValidatorSpy } = makeSut();
    const dummyRequest = {
      cookies: {
        refreshToken: "revoked_token",
      },
    };
    refreshTokenValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("UNAUTHORIZED");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(401);
    expect(httpResponse.body.message).toEqual("Invalid credentials");
  });
});
