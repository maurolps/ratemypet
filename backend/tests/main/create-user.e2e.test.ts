import { makeApp } from "@main/http/app";
import { describe, it, expect } from "vitest";
import request from "supertest";

describe("[E2E] UC-001 CreateUser", () => {
  it("Should create a user and return status 201", async () => {
    const app = makeApp();
    const userDTO = {
      name: "any_name",
      email: "valid_mail@mail.com",
      password: "any_password",
    };
    const response = await request(app).post("/api/users").send(userDTO);

    expect(response.status).toBe(201);
    expect(response.body.name).toEqual(userDTO.name);
    expect(response.body.email).toEqual(userDTO.email);
    expect(response.body.id).toBeTruthy();
  });
});
