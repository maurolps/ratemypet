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

  it("Should save refresh token without throwing an error", async () => {
    const sut = new PgRefreshTokenRepository();
    const promise = sut.save(refreshTokenDTO);
    await expect(promise).resolves.not.toThrow();
  });

  it;
});
