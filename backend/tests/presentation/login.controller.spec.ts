import { LoginController } from "@presentation/controllers/login.controler";
import { describe, expect, it, vi } from "vitest";
import { LoginValidatorStub } from "./doubles/login.validator.stub";
import { AppError } from "@application/errors/app-error";

describe("LoginController", () => {
  const makeSut = () => {
    const loginValidatorStub = new LoginValidatorStub();
    const sut = new LoginController(loginValidatorStub);
    const loginValidatorSpy = vi.spyOn(loginValidatorStub, "execute");
    return { sut, loginValidatorStub, loginValidatorSpy };
  };

  it("Should return 200 on successful login", async () => {
    const { sut } = makeSut();
    const dummyRequest = {
      body: {
        email: "valid_mail@mail.com",
        password: "valid_password",
      },
    };

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
  });
  it("Should return 400 if body is missing", async () => {
    const { sut, loginValidatorSpy } = makeSut();
    const dummyRequest = {};
    loginValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("MISSING_BODY");
    });

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Missing request body");
  });
});
