import { it, describe, expect } from "vitest";
import { PgRefreshTokenRepository } from "@infra/db/postgres/pg-refresh-token.repository";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import crypto from "node:crypto";

const insertFakeUser = async (userId: string) => {
  const pool = PgPool.getInstance();
  await pool.query(
    `INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)`,
    [userId, "any_name", "fake_email@mail.com", "hashed_password"],
  );
};

describe("PgRefreshTokenRepository", () => {
  const refreshTokenDTO = {
    id: "valid_refresh_token_id",
    user_id: crypto.randomUUID(),

    token_hash: "valid_token_hash",
  };

  it("Should save refresh token without throwing an error", async () => {
    const sut = new PgRefreshTokenRepository();
    await insertFakeUser(refreshTokenDTO.user_id);
    const promise = sut.save(refreshTokenDTO);
    await expect(promise).resolves.not.toThrow();
  });
});
