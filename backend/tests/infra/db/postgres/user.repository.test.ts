import type { CreateUserData } from "@application/repositories/create-user.repository";
import { it, describe, expect } from "vitest";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";

describe("PgUserRepository", () => {
  const userDTO: CreateUserData = {
    name: "valid_name",
    email: "valid_email@mail.com",
    display_name: "valid_display_name",
    bio: "Pet lover 🐶",
  };

  describe("create", () => {
    it("Should persist and return an User on success", async () => {
      const sut = new PgUserRepository();
      const user = await sut.create(userDTO);
      expect(user.id).toBeTruthy();
      expect(user.name).toEqual("valid_name");
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
        display_name: "custom_display_name",
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
  });

  describe("findByEmail", () => {
    it("Should return an User on success", async () => {
      const sut = new PgUserRepository();
      const user = await sut.findByEmail(userDTO.email);
      expect(user?.name).toEqual(userDTO.name);
      expect(user?.created_at).toBeInstanceOf(Date);
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
        display_name: "valid_user_name",
        bio: "Pet lover 🐶",
      };
      const createdUser = await sut.create(newUser);

      const user = await sut.findById(createdUser.id);

      expect(user?.name).toEqual(newUser.name);
      expect(user?.created_at).toBeInstanceOf(Date);
    });
    it("Should return null on fail", async () => {
      const sut = new PgUserRepository();

      const response = await sut.findById(crypto.randomUUID());

      expect(response).toBeNull();
    });
  });
});
