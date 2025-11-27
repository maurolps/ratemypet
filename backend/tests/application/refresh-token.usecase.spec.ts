import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { RefreshTokenRepositoryStub } from "./doubles/refresh-token.repository.stub";
import { RefreshTokenUseCase } from "@application/usecases/refresh-token.usecase";
import { AppError } from "@application/errors/app-error";
import { FIXED_DATE } from "../config/constants";
import { HasherStub } from "./doubles/hasher.stub";

describe("RefreshTokenUseCase", () => {
  const makeSut = () => {
    const refreshTokenRepositoryStub = new RefreshTokenRepositoryStub();
    const hasherStub = new HasherStub();
    const hasherSpy = vi.spyOn(hasherStub, "compare");
    const findTokenByIdSpy = vi.spyOn(refreshTokenRepositoryStub, "findById");
    const sut = new RefreshTokenUseCase(refreshTokenRepositoryStub, hasherStub);
    return {
      sut,
      findTokenByIdSpy,
      hasherSpy,
    };
  };

  const validDummyToken = {
    id: "refresh_token_id",
    secret: "refresh_token_secret",
  };

  it("Should call RefreshTokenRepository.findById with correct values", async () => {
    const { sut, findTokenByIdSpy } = makeSut();
    await sut.execute(validDummyToken);
    expect(findTokenByIdSpy).toHaveBeenCalledWith(validDummyToken.id);
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
    const promise = sut.execute(dummyToken);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });

  it("Should call Hasher.compare with correct values", async () => {
    const { sut, hasherSpy } = makeSut();
    const secret = validDummyToken.secret;
    await sut.execute(validDummyToken);
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
      const promise = sut.execute(dummyToken);
      await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
    });
  });
});
