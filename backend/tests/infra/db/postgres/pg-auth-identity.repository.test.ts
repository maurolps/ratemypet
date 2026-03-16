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
        identifier: user.email,
        provider_user_id: null,
        password_hash: "hashed_password",
      });

      expect(authIdentity.id).toBeTruthy();
      expect(authIdentity.user_id).toEqual(user.id);
      expect(authIdentity.provider).toEqual("local");
      expect(authIdentity.identifier).toEqual(user.email);
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
        identifier: user.email,
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

  describe("findByProviderAndIdentifier", () => {
    it("Should return an AuthIdentity on success", async () => {
      const sut = makeSut();
      const user = await insertFakeUser(`user_${crypto.randomUUID()}@mail.com`);
      const createdAuthIdentity = await sut.create({
        user_id: user.id,
        provider: "local",
        identifier: user.email,
        provider_user_id: null,
        password_hash: "hashed_password",
      });

      const authIdentity = await sut.findByProviderAndIdentifier(
        "local",
        user.email,
      );

      expect(authIdentity).toEqual(createdAuthIdentity);
    });

    it("Should return null on fail", async () => {
      const sut = makeSut();

      const authIdentity = await sut.findByProviderAndIdentifier(
        "local",
        "non_exists@email.com",
      );

      expect(authIdentity).toBeNull();
    });
  });

  describe("findByProviderUserId", () => {
    it("Should return an AuthIdentity on success", async () => {
      const sut = makeSut();
      const user = await insertFakeUser(`user_${crypto.randomUUID()}@mail.com`);
      const createdAuthIdentity = await sut.create({
        user_id: user.id,
        provider: "google",
        identifier: user.email,
        provider_user_id: crypto.randomUUID(),
        password_hash: "hashed_password",
      });

      const authIdentity = await sut.findByProviderUserId(
        "google",
        createdAuthIdentity.provider_user_id as string,
      );

      expect(authIdentity).toEqual(createdAuthIdentity);
    });

    it("Should return null on fail", async () => {
      const sut = makeSut();

      const authIdentity = await sut.findByProviderUserId(
        "google",
        crypto.randomUUID(),
      );

      expect(authIdentity).toBeNull();
    });
  });

  describe("constraints", () => {
    it("Should reject duplicated provider and identifier", async () => {
      const sut = makeSut();
      const firstUser = await insertFakeUser(
        `user_${crypto.randomUUID()}@mail.com`,
      );
      const secondUser = await insertFakeUser(
        `user_${crypto.randomUUID()}@mail.com`,
      );
      const duplicatedIdentifier = `duplicated_${crypto.randomUUID()}@mail.com`;

      await sut.create({
        user_id: firstUser.id,
        provider: "local",
        identifier: duplicatedIdentifier,
        provider_user_id: null,
        password_hash: "hashed_password",
      });

      await expect(
        sut.create({
          user_id: secondUser.id,
          provider: "local",
          identifier: duplicatedIdentifier,
          provider_user_id: null,
          password_hash: "hashed_password",
        }),
      ).rejects.toThrow();
    });

    it("Should reject duplicated non-null provider_user_id", async () => {
      const sut = makeSut();
      const firstUser = await insertFakeUser(
        `user_${crypto.randomUUID()}@mail.com`,
      );
      const secondUser = await insertFakeUser(
        `user_${crypto.randomUUID()}@mail.com`,
      );
      const providerUserId = crypto.randomUUID();

      await sut.create({
        user_id: firstUser.id,
        provider: "google",
        identifier: `first_${crypto.randomUUID()}@mail.com`,
        provider_user_id: providerUserId,
        password_hash: "hashed_password",
      });

      await expect(
        sut.create({
          user_id: secondUser.id,
          provider: "google",
          identifier: `second_${crypto.randomUUID()}@mail.com`,
          provider_user_id: providerUserId,
          password_hash: "hashed_password",
        }),
      ).rejects.toThrow();
    });
  });
});
