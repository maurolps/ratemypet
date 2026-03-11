import type { CreateUserData } from "@application/repositories/create-user.repository";
import { it, describe, expect } from "vitest";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";

describe("PgUserRepository", () => {
  const userDTO: CreateUserData = {
    name: "valid_name",
    email: "valid_email@mail.com",
  };

  describe("create", () => {
    it("Should persist and return an User on success", async () => {
      const sut = new PgUserRepository();
      const user = await sut.create(userDTO);
      expect(user.id).toBeTruthy();
      expect(user.name).toEqual("valid_name");
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
