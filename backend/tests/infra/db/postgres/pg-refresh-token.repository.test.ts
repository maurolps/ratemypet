import type { RefreshTokenDTO } from "@domain/entities/token";
import type { User } from "@domain/entities/user";
import { it, describe, expect, beforeAll } from "vitest";
import { PgRefreshTokenRepository } from "@infra/db/postgres/pg-refresh-token.repository";
import { insertFakeUser } from "./helpers/fake-user";

describe("PgRefreshTokenRepository", () => {
  let refreshTokenDTO: RefreshTokenDTO;
  let user: User;

  beforeAll(async () => {
    user = await insertFakeUser();
    refreshTokenDTO = {
      id: "valid_refresh_token_id",
      user_id: user.id,
      token_hash: "valid_token_hash",
    };
  });

  describe("save", () => {
    it("Should save refresh token without throwing an error", async () => {
      const sut = new PgRefreshTokenRepository();
      const promise = sut.save(refreshTokenDTO);
      await expect(promise).resolves.not.toThrow();
    });
  });

  describe("findById", () => {
    it("Should return a valid refresh token on success", async () => {
      const sut = new PgRefreshTokenRepository();
      const refreshToken = await sut.findById(refreshTokenDTO.id);
      expect(refreshToken).toBeTruthy();
      expect(refreshToken?.user_id).toEqual(refreshTokenDTO.user_id);
      expect(refreshToken?.expires_at).toBeInstanceOf(Date);
      expect(refreshToken?.revoked_at).toBeFalsy();
    });

    it("Should return null when refresh token does not exist", async () => {
      const sut = new PgRefreshTokenRepository();
      const refreshToken = await sut.findById("non_existent_id");
      expect(refreshToken).toBeNull();
    });
  });

  describe("revoke", () => {
    it("Should revoke the refresh token without throwing an error", async () => {
      const sut = new PgRefreshTokenRepository();
      const promise = sut.revoke(refreshTokenDTO.id);
      await expect(promise).resolves.not.toThrow();
    });

    it("Should set revoked_at when revoking a refresh token", async () => {
      const sut = new PgRefreshTokenRepository();
      await sut.revoke(refreshTokenDTO.id);
      const revokedToken = await sut.findById(refreshTokenDTO.id);
      expect(revokedToken).toBeTruthy();
      expect(revokedToken?.revoked_at).toBeInstanceOf(Date);
    });
  });
});
