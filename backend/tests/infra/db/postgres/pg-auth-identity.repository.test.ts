import { describe, expect, it } from "vitest";
import { PgAuthIdentityRepository } from "@infra/db/postgres/pg-auth-identity.repository";
import { insertFakeUser } from "./helpers/fake-user";

describe("PgAuthIdentityRepository", () => {
  const makeSut = () => {
    return new PgAuthIdentityRepository();
  };

  describe("create", () => {
    it("Should persist and return an AuthIdentity on success", async () => {
      const sut = makeSut();
      const user = await insertFakeUser(`user_${crypto.randomUUID()}@mail.com`);

      const authIdentity = await sut.create({
        user_id: user.id,
        provider: "local",
        provider_user_id: null,
        password_hash: "hashed_password",
      });

      expect(authIdentity.id).toBeTruthy();
      expect(authIdentity.user_id).toEqual(user.id);
      expect(authIdentity.provider).toEqual("local");
      expect(authIdentity.password_hash).toEqual("hashed_password");
      expect(authIdentity.created_at).toBeInstanceOf(Date);
    });
  });

  describe("findByUserIdAndProvider", () => {
    it("Should return an AuthIdentity on success", async () => {
      const sut = makeSut();
      const user = await insertFakeUser(`user_${crypto.randomUUID()}@mail.com`);
      const createdAuthIdentity = await sut.create({
        user_id: user.id,
        provider: "local",
        provider_user_id: null,
        password_hash: "hashed_password",
      });

      const authIdentity = await sut.findByUserIdAndProvider(user.id, "local");

      expect(authIdentity).toEqual(createdAuthIdentity);
    });

    it("Should return null on fail", async () => {
      const sut = makeSut();

      const authIdentity = await sut.findByUserIdAndProvider(
        crypto.randomUUID(),
        "local",
      );

      expect(authIdentity).toBeNull();
    });
  });
});
