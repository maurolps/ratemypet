import type { CreateUserDTO } from "@domain/usecases/create-user.contract";
import { it, describe, expect } from "vitest";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";

describe("PgUserRepository", () => {
  const userDTO: CreateUserDTO = {
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "hashed_password",
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
    it("Should return an User with passwordHash on success", async () => {
      const sut = new PgUserRepository();
      const user = await sut.findByEmail(userDTO.email);
      expect(user?.name).toEqual(userDTO.name);
      expect(user?.password_hash).toEqual(userDTO.password);
      expect(user?.created_at).toBeInstanceOf(Date);
    });
    it("Should return null on fail", async () => {
      const sut = new PgUserRepository();

      const response = await sut.findByEmail("non_exists@email.com");

      expect(response).toBeNull();
    });
  });
});
