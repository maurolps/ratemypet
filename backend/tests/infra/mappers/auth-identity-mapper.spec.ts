import { describe, expect, it } from "vitest";
import { toAuthIdentity } from "@infra/mappers/auth-identity-mapper";

describe("toAuthIdentity", () => {
  it("Should keep created_at as-is when it is already a Date", () => {
    const createdAt = new Date("2026-03-10T12:00:00.000Z");

    const authIdentity = toAuthIdentity({
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider: "local",
      identifier: "valid_email@mail.com",
      provider_user_id: null,
      password_hash: "hashed_password",
      created_at: createdAt,
    });

    expect(authIdentity).toEqual({
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider: "local",
      identifier: "valid_email@mail.com",
      provider_user_id: null,
      password_hash: "hashed_password",
      created_at: createdAt,
    });
  });

  it("Should convert created_at when it is a string", () => {
    const authIdentity = toAuthIdentity({
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider: "local",
      identifier: "valid_email@mail.com",
      provider_user_id: null,
      password_hash: "hashed_password",
      created_at: "2026-03-10T12:00:00.000Z",
    });

    expect(authIdentity.created_at).toBeInstanceOf(Date);
    expect(authIdentity.created_at.toISOString()).toBe(
      "2026-03-10T12:00:00.000Z",
    );
  });
});
