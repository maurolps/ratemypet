import { AppError } from "@presentation/errors/app-error";
import { CreateUserController } from "@presentation/controllers/create-user.controller";
import { describe, expect, it, vi } from "vitest";
import { CreateUserStub } from "./doubles/create-user.usecase.stub";

describe("CreateUserController", () => {
  const makeSut = () => {
    const createUserStub = new CreateUserStub();
    const sut = new CreateUserController(createUserStub);
    const createUserSpy = vi.spyOn(createUserStub, "execute");
    return { sut, createUserStub, createUserSpy };
  };

  it("Should return 201 when user is created successfully", async () => {
    const { sut } = makeSut();
    const dummyRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      },
    };

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(201);
  });

  it("Should call CreateUser usecase with correct values", async () => {
    const { sut, createUserSpy } = makeSut();
    const dummyRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };

    await sut.handle(dummyRequest);

    expect(createUserSpy).toHaveBeenCalledWith({
      name: dummyRequest.body.name,
      email: dummyRequest.body.email,
      password: dummyRequest.body.password,
    });
  });

  it("Should return 500 on unexpected error", async () => {
    const { sut, createUserSpy } = makeSut();
    createUserSpy.mockRejectedValueOnce(new Error("any_error"));
    const dummyRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(500);
    expect(httpResponse.body.message).toEqual("Internal server error");
  });

  it("Should return 409 when email is already in use", async () => {
    const { sut, createUserSpy } = makeSut();
    createUserSpy.mockRejectedValueOnce(new AppError("EMAIL_TAKEN"));
    const dummyRequest = {
      body: {
        name: "any_name",
        email: "taken_email",
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(409);
    expect(httpResponse.body.message).toEqual("Email already in use");
  });
});
