import { LoginController } from "@presentation/controllers/login.controler";
import { describe, expect, it } from "vitest";

describe("LoginController", () => {
  it("Should return 200 on successful login", async () => {
    const sut = new LoginController();
    const dummyRequest = {
      body: {
        email: "valid_mail@mail.com",
        password: "valid_password",
      },
    };

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
  });
});
