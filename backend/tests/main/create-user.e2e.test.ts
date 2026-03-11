import { makeApp } from "@main/http/app";
import { PgAuthIdentityRepository } from "@infra/db/postgres/pg-auth-identity.repository";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { describe, it, expect } from "vitest";
import request from "supertest";

const makeSut = () => {
  const app = makeApp();
  const userRepository = new PgUserRepository();
  const authIdentityRepository = new PgAuthIdentityRepository();

  return {
    app,
    userRepository,
    authIdentityRepository,
  };
};

describe("[E2E] UC-001 CreateUser", () => {
  it("Should create a user and return status 201", async () => {
    const { app, userRepository, authIdentityRepository } = makeSut();
    const userDTO = {
      name: "any_name",
      email: `user_${crypto.randomUUID()}@mail.com`,
      password: "any_password",
    };

    const response = await request(app).post("/api/users").send(userDTO);
    const savedUser = await userRepository.findByEmail(userDTO.email);
    const authIdentity = savedUser
      ? await authIdentityRepository.findByUserIdAndProvider(
          savedUser.id,
          "local",
        )
      : null;

    expect(response.status).toBe(201);
    expect(response.body.name).toEqual(userDTO.name);
    expect(response.body.email).toEqual(userDTO.email);
    expect(response.body.id).toBeTruthy();
    expect(savedUser).not.toBeNull();
    expect(new Date(response.body.created_at).toString()).not.toBe(
      "Invalid Date",
    );
    expect(response.body.created_at).toEqual(
      savedUser?.created_at.toISOString(),
    );
    expect(authIdentity).not.toBeNull();
    expect(authIdentity?.password_hash).toBeTruthy();
  });
});
