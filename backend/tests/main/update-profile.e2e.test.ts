import { makeApp } from "@main/http/app";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { describe, expect, it } from "vitest";
import request from "supertest";
import { createAndLoginUser } from "./helpers/create-and-login-user";

const makeSut = () => {
  const app = makeApp();
  const userRepository = new PgUserRepository();

  return {
    app,
    userRepository,
  };
};

describe("[E2E] UC-018 UpdateProfile", () => {
  it("Should update only displayName and preserve bio", async () => {
    const { app, userRepository } = makeSut();
    const user = await createAndLoginUser(app);
    const existingUser = await userRepository.findById(user.userId);

    const response = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        displayName: "Updated Name",
      });

    const updatedUser = await userRepository.findById(user.userId);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: user.userId,
      displayName: "Updated Name",
      bio: existingUser?.bio ?? "",
    });
    expect(updatedUser?.displayName).toBe("Updated Name");
    expect(updatedUser?.bio).toBe(existingUser?.bio);
    expect(response.body.email).toBeUndefined();
    expect(response.body.picture).toBeUndefined();
  });
});
