import { FIXED_DATE } from "../../config/constants";
import type { AccessTokenPayload } from "@domain/entities/token";
import { describe, expect, it, vi } from "vitest";
import { HasherStub } from "../doubles/hasher.stub";
import { TokenGeneratorStub } from "../doubles/token-generator.stub";
import { RefreshTokenRepositoryStub } from "../doubles/refresh-token.repository.stub";
import { TokenIssuerService } from "@application/services/token-issuer.service";

const makeAccessTokenGeneratorSpy = () => {
  const accessTokenGeneratorStub = new TokenGeneratorStub<AccessTokenPayload>();
  const accessTokenGeneratorSpy = vi.spyOn(accessTokenGeneratorStub, "issue");
  return { accessTokenGeneratorStub, accessTokenGeneratorSpy };
};

const makeRefreshTokenGeneratorSpy = () => {
  const refreshTokenGeneratorStub = new TokenGeneratorStub();
  const refreshTokenGeneratorSpy = vi.spyOn(refreshTokenGeneratorStub, "issue");
  return { refreshTokenGeneratorStub, refreshTokenGeneratorSpy };
};

const makeRefreshTokenRepositorySpy = () => {
  const refreshTokenRepositoryStub = new RefreshTokenRepositoryStub();
  const refreshTokenRepositorySpy = vi.spyOn(
    refreshTokenRepositoryStub,
    "save",
  );
  return { refreshTokenRepositoryStub, refreshTokenRepositorySpy };
};

describe("TokenIssuerService", () => {
  const makeSut = () => {
    const hasherStub = new HasherStub();
    const { accessTokenGeneratorStub, accessTokenGeneratorSpy } =
      makeAccessTokenGeneratorSpy();
    const { refreshTokenGeneratorStub, refreshTokenGeneratorSpy } =
      makeRefreshTokenGeneratorSpy();
    const { refreshTokenRepositoryStub, refreshTokenRepositorySpy } =
      makeRefreshTokenRepositorySpy();
    const sut = new TokenIssuerService(
      hasherStub,
      accessTokenGeneratorStub,
      refreshTokenGeneratorStub,
      refreshTokenRepositoryStub,
    );
    return {
      sut,
      hasherStub,
      accessTokenGeneratorSpy,
      refreshTokenGeneratorSpy,
      refreshTokenRepositorySpy,
    };
  };

  const fakeUser = {
    id: "valid_user_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    created_at: FIXED_DATE,
    passwordHash: "valid_password",
  };

  it("Should call AccessTokenGenerator with correct values", async () => {
    const { sut, accessTokenGeneratorSpy } = makeSut();
    await sut.execute(fakeUser);
    expect(accessTokenGeneratorSpy).toHaveBeenCalledWith({
      sub: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
    });
    expect(accessTokenGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it("Should reThrow if TokenGenerator throws", async () => {
    const { sut, accessTokenGeneratorSpy } = makeSut();
    accessTokenGeneratorSpy.mockImplementationOnce(() => {
      throw new Error("Error");
    });
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow();
  });

  it("Should call TokenGenerator to issue a refreshToken", async () => {
    const { sut, refreshTokenGeneratorSpy } = makeSut();
    await sut.execute(fakeUser);
    expect(refreshTokenGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it("Should call Hasher with correct refresh token secret", async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = vi.spyOn(hasherStub, "hash");
    await sut.execute(fakeUser);
    expect(hashSpy).toHaveBeenCalledWith("refresh_token");
  });

  it("Should call RefreshTokenRepository with correct values", async () => {
    const { sut, refreshTokenRepositorySpy } = makeSut();
    await sut.execute(fakeUser);
    expect(refreshTokenRepositorySpy).toHaveBeenCalledWith({
      id: "valid_token_id",
      user_id: "valid_user_id",
      token_hash: "hashed_refresh_token",
    });
  });

  it("Should return correct tokens on success", async () => {
    const { sut } = makeSut();
    const tokens = await sut.execute(fakeUser);
    expect(tokens).toEqual({
      accessToken: "valid_access_token",
      refreshToken: "valid_token_id.refresh_token",
    });
  });
});
