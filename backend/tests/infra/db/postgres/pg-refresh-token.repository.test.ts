import { it, describe, expect } from "vitest";
import { PgRefreshTokenRepository } from "@infra/db/postgres/pg-refresh-token.repository";
import { insertFakeUser } from "./helpers/fake-user";

describe("PgRefreshTokenRepository", () => {
  it("Should save refresh token without throwing an error", async () => {
    const sut = new PgRefreshTokenRepository();
    const user = await insertFakeUser();
    const refreshTokenDTO = {
      id: "valid_refresh_token_id",
      user_id: user.id,
      token_hash: "valid_token_hash",
    };
    const promise = sut.save(refreshTokenDTO);
    await expect(promise).resolves.not.toThrow();
  });
});
