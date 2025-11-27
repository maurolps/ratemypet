import type { AccessTokenPayload } from "@domain/entities/token";
import { FIXED_DATE } from "../../config/constants";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { HasherStub } from "../doubles/hasher.stub";
import { TokenGeneratorStub } from "../doubles/token-generator.stub";
import { RefreshTokenRepositoryStub } from "../doubles/refresh-token.repository.stub";
import { TokenIssuerService } from "@application/services/token-issuer.service";
import { AppError } from "@application/errors/app-error";

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

    const findTokenByIdSpy = vi.spyOn(refreshTokenRepositoryStub, "findById");

    return {
      sut,
      hasherStub,
      accessTokenGeneratorSpy,
      refreshTokenGeneratorSpy,
      refreshTokenRepositorySpy,
      findTokenByIdSpy,
    };
  };

  const fakeUser = {
    id: "valid_user_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    created_at: FIXED_DATE,
    passwordHash: "valid_password",
  };

  describe("execute", () => {
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

    it("Should throw if refresh token format is invalid", async () => {
      const { sut, refreshTokenGeneratorSpy } = makeSut();
      refreshTokenGeneratorSpy.mockResolvedValueOnce("invalid_refresh_token");
      const promise = sut.execute(fakeUser);
      await expect(promise).rejects.toThrow();
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

  describe("validateRefreshToken", () => {
    const validDummyToken = {
      id: "refresh_token_id",
      secret: "refresh_token_secret",
    };

    it("Should call RefreshTokenRepository.findById with correct values", async () => {
      const { sut, findTokenByIdSpy } = makeSut();
      await sut.validateRefreshToken(validDummyToken);
      expect(findTokenByIdSpy).toHaveBeenCalledWith(validDummyToken.id);
    });

    it("Should throw UNAUTHORIZED when token is not found", async () => {
      const { sut, findTokenByIdSpy } = makeSut();
      findTokenByIdSpy.mockResolvedValueOnce(null);
      const dummyToken = {
        id: "non_existing_token_id",
        secret: "any_secret",
      };
      const promise = sut.validateRefreshToken(dummyToken);
      await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
    });

    it("Should throw UNAUTHORIZED when token is revoked", async () => {
      const { sut, findTokenByIdSpy } = makeSut();
      findTokenByIdSpy.mockResolvedValueOnce({
        id: "revoked_token_id",
        user_id: "any_user_id",
        token_hash: "any_hash",
        revoked_at: Date.now(),
      });
      const dummyToken = {
        id: "revoked_token_id",
        secret: "any_secret",
      };
      const promise = sut.validateRefreshToken(dummyToken);
      await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
    });

    it("Should call Hasher.compare with correct values", async () => {
      const { sut, hasherStub } = makeSut();
      const hasherSpy = vi.spyOn(hasherStub, "compare");
      const secret = validDummyToken.secret;
      await sut.validateRefreshToken(validDummyToken);
      expect(hasherSpy).toHaveBeenCalledWith(secret, `hashed_${secret}`);
    });

    describe("Expiration Handling", () => {
      beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FIXED_DATE.getTime() + 2000);
      });

      afterAll(() => {
        vi.useRealTimers();
      });

      it("Should throw UNAUTHORIZED when token is expired", async () => {
        const { sut, findTokenByIdSpy } = makeSut();
        const created_at = FIXED_DATE.getTime();
        const expires_at = FIXED_DATE.getTime() + 1000;

        findTokenByIdSpy.mockResolvedValueOnce({
          id: "expired_token_id",
          user_id: "any_user_id",
          token_hash: "any_hash",
          created_at,
          expires_at,
        });

        const dummyToken = {
          id: "expired_token_id",
          secret: "any_secret",
        };
        const promise = sut.validateRefreshToken(dummyToken);
        await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
      });
    });
  });
});
