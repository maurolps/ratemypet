import type { LoginDTO } from "@domain/usecases/login.contract";
import { LoginController } from "@presentation/controllers/login.controler";
import { describe, expect, it, vi } from "vitest";
import { LoginValidatorStub } from "./doubles/login.validator.stub";
import { AppError } from "@application/errors/app-error";
import { LoginUseCaseStub } from "./doubles/login.usecase.stub";

describe("LoginController", () => {
  const makeSut = () => {
    const loginValidatorStub = new LoginValidatorStub();
    const loginUseCaseStub = new LoginUseCaseStub();
    const sut = new LoginController(loginValidatorStub, loginUseCaseStub);
    const loginValidatorSpy = vi.spyOn(loginValidatorStub, "execute");
    const loginUseCaseSpy = vi.spyOn(loginUseCaseStub, "auth");
    return { sut, loginValidatorSpy, loginUseCaseSpy };
  };

  const makeRequest = (overrides: Partial<LoginDTO>) => {
    return {
      body: {
        email: "valid_email@mail.com",
        password: "valid_password",
        ...overrides,
      },
    };
  };

  it("Should return 200 on successful login", async () => {
    const { sut } = makeSut();
    const dummyRequest = makeRequest({});
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

  it("Should call HttpValidator with correct values", async () => {
    const { sut, loginValidatorSpy } = makeSut();
    const dummyRequest = makeRequest({});
    await sut.handle(dummyRequest);
    expect(loginValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should return 400 if email or password is missing", async () => {
    const { sut, loginValidatorSpy } = makeSut();
    const dummyRequest = {
      body: {
        email: "valid_email@mail.com",
      },
    };
    loginValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("MISSING_PARAM", "email");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Missing Param: email");
  });

  it("Should call LoginUseCase with correct values", async () => {
    const { sut, loginUseCaseSpy } = makeSut();
    const dummyRequest = makeRequest({});
    await sut.handle(dummyRequest);
    expect(loginUseCaseSpy).toHaveBeenCalledWith(dummyRequest.body);
  });

  it("Should return Unauthorized if login fails", async () => {
    const { sut, loginUseCaseSpy } = makeSut();
    const dummyRequest = makeRequest({});
    loginUseCaseSpy.mockImplementationOnce(() => {
      throw new AppError("UNAUTHORIZED");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(401);
    expect(httpResponse.body.message).toEqual("Invalid credentials");
  });

  it("Should rethrow if LoginUseCase throws", async () => {
    const { sut, loginUseCaseSpy } = makeSut();
    const dummyRequest = makeRequest({});
    loginUseCaseSpy.mockRejectedValueOnce(new Error("any_error"));
    const httpResponse = sut.handle(dummyRequest);
    await expect(httpResponse).rejects.toThrow();
  });

  it("Should return logged user with tokens on successful login", async () => {
    const { sut } = makeSut();
    const dummyRequest = makeRequest({});
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.body).toHaveProperty("id");
    expect(httpResponse.body).toHaveProperty("name");
    expect(httpResponse.body).toHaveProperty("email");
    expect(httpResponse.body).toHaveProperty("tokens");
  });
});
