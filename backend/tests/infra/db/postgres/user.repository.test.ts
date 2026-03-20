import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { CreateUserData } from "@application/repositories/create-user.repository";
import { it, describe, expect } from "vitest";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { FIXED_DATE } from "../../../config/constants";

describe("PgUserRepository", () => {
  const userDTO: CreateUserData = {
    name: "valid_name",
    email: "valid_email@mail.com",
    displayName: "valid_display_name",
    bio: "Pet lover 🐶",
  };

  describe("create", () => {
    it("Should persist and return an User on success", async () => {
      const sut = new PgUserRepository();
      const user = await sut.create(userDTO);
      expect(user.id).toBeTruthy();
      expect(user.name).toEqual("valid_name");
      expect(user.displayName).toEqual("valid_display_name");
      expect(user.bio).toEqual("Pet lover 🐶");
    });

    it("Should persist picture when provided", async () => {
      const sut = new PgUserRepository();
      const user = await sut.create({
        ...userDTO,
        picture: "https://valid.picture/image.png",
      });

      expect(user.picture).toEqual("https://valid.picture/image.png");
    });

    it("Should persist display_name and bio when provided", async () => {
      const sut = new PgUserRepository();
      const pool = PgPool.getInstance();
      const email = `user_${crypto.randomUUID()}@mail.com`;
      const user = await sut.create({
        ...userDTO,
        email,
        displayName: "custom_display_name",
        bio: "custom_bio",
      });

      const persistedRows = await pool.query<{
        display_name: string;
        bio: string;
      }>(
        `
        SELECT display_name, bio
        FROM users
        WHERE id = $1
        `,
        [user.id],
      );

      expect(persistedRows.rows[0]).toEqual({
        display_name: "custom_display_name",
        bio: "custom_bio",
      });
    });

    it("Should use the provided transaction when available", async () => {
      const sut = new PgUserRepository();
      const transaction = {
        query: async () => ({
          rows: [
            {
              id: "transaction_user_id",
              name: "transaction_name",
              email: "transaction@mail.com",
              display_name: "transaction_display_name",
              bio: "transaction_bio",
              picture: null,
              created_at: FIXED_DATE,
            },
          ],
        }),
      } as Transaction;

      const user = await sut.create(
        {
          ...userDTO,
          email: "transaction@mail.com",
        },
        transaction,
      );

      expect(user).toEqual({
        id: "transaction_user_id",
        name: "transaction_name",
        email: "transaction@mail.com",
        displayName: "transaction_display_name",
        bio: "transaction_bio",
        createdAt: FIXED_DATE,
      });
    });
  });

  describe("findByEmail", () => {
    it("Should return an User on success", async () => {
      const sut = new PgUserRepository();
      const user = await sut.findByEmail(userDTO.email);
      expect(user?.name).toEqual(userDTO.name);
      expect(user?.displayName).toEqual(userDTO.displayName);
      expect(user?.createdAt).toBeInstanceOf(Date);
    });
    it("Should return null on fail", async () => {
      const sut = new PgUserRepository();

      const response = await sut.findByEmail("non_exists@email.com");

      expect(response).toBeNull();
    });
  });

  describe("findById", () => {
    it("Should return an User on success", async () => {
      const sut = new PgUserRepository();
      const newUser: CreateUserData = {
        name: "valid_user_name",
        email: "valid_user_email@mail.com",
        displayName: "valid_user_name",
        bio: "Pet lover 🐶",
      };
      const createdUser = await sut.create(newUser);

      const user = await sut.findById(createdUser.id);

      expect(user?.name).toEqual(newUser.name);
      expect(user?.displayName).toEqual(newUser.displayName);
      expect(user?.createdAt).toBeInstanceOf(Date);
    });
    it("Should return null on fail", async () => {
      const sut = new PgUserRepository();

      const response = await sut.findById(crypto.randomUUID());

      expect(response).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("Should update only display_name and preserve bio", async () => {
      const sut = new PgUserRepository();
      const createdUser = await sut.create({
        ...userDTO,
        email: `user_${crypto.randomUUID()}@mail.com`,
        displayName: "original_display_name",
        bio: "original_bio",
      });

      const updatedUser = await sut.updateProfile({
        id: createdUser.id,
        displayName: "updated_display_name",
      });

      expect(updatedUser?.displayName).toEqual("updated_display_name");
      expect(updatedUser?.bio).toEqual("original_bio");
    });

    it("Should update only bio and preserve display_name", async () => {
      const sut = new PgUserRepository();
      const createdUser = await sut.create({
        ...userDTO,
        email: `user_${crypto.randomUUID()}@mail.com`,
        displayName: "original_display_name",
        bio: "original_bio",
      });

      const updatedUser = await sut.updateProfile({
        id: createdUser.id,
        bio: "updated_bio",
      });

      expect(updatedUser?.displayName).toEqual("original_display_name");
      expect(updatedUser?.bio).toEqual("updated_bio");
    });

    it("Should update display_name and bio together", async () => {
      const sut = new PgUserRepository();
      const createdUser = await sut.create({
        ...userDTO,
        email: `user_${crypto.randomUUID()}@mail.com`,
        displayName: "original_display_name",
        bio: "original_bio",
      });

      const updatedUser = await sut.updateProfile({
        id: createdUser.id,
        displayName: "updated_display_name",
        bio: "updated_bio",
      });

      expect(updatedUser?.displayName).toEqual("updated_display_name");
      expect(updatedUser?.bio).toEqual("updated_bio");
    });

    it("Should persist empty bio when provided", async () => {
      const sut = new PgUserRepository();
      const pool = PgPool.getInstance();
      const createdUser = await sut.create({
        ...userDTO,
        email: `user_${crypto.randomUUID()}@mail.com`,
        displayName: "original_display_name",
        bio: "original_bio",
      });

      const updatedUser = await sut.updateProfile({
        id: createdUser.id,
        bio: "",
      });
      const persistedRows = await pool.query<{ bio: string }>(
        `
        SELECT bio
        FROM users
        WHERE id = $1
        `,
        [createdUser.id],
      );

      expect(updatedUser?.bio).toEqual("");
      expect(persistedRows.rows[0].bio).toEqual("");
    });

    it("Should return null when trying to update a non-existing user", async () => {
      const sut = new PgUserRepository();

      const updatedUser = await sut.updateProfile({
        id: crypto.randomUUID(),
        displayName: "updated_display_name",
      });

      expect(updatedUser).toBeNull();
    });
  });
});
