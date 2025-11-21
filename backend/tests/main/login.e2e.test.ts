import { makeApp } from "@main/http/app";
import { describe, it, expect } from "vitest";
import request from "supertest";

describe("[E2E] UC-002 Login", () => {
  it("Should login an existing user and return credentials with status 200", async () => {
    const app = makeApp();
    const userDTO = {
      name: "any_name",
      email: "any_email@example.com",
      password: "any_password",
    };

    await request(app).post("/api/users").send(userDTO);

    const response = await request(app).post("/api/users/login").send({
      email: userDTO.email,
      password: userDTO.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.tokens.accessToken).toBeTruthy();

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];
    const refreshTokenCookie = cookiesArray.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );
    expect(refreshTokenCookie).toBeDefined();
  });
});
