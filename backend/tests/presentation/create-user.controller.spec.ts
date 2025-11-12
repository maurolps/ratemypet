import { AppError } from "@application/errors/app-error";
import { CreateUserController } from "@presentation/controllers/create-user.controller";
import { describe, expect, it, vi } from "vitest";
import { CreateUserStub } from "./doubles/create-user.usecase.stub";
import { CreateUserValidatorStub } from "./doubles/create-user.validator.stub";
import { TokenIssuerServiceStub } from "../application/doubles/token-issuer.service.stub";

describe("CreateUserController", () => {
  const makeSut = () => {
    const createUserStub = new CreateUserStub();
    const createUserValidatorStub = new CreateUserValidatorStub();
    const tokenIssuerServiceStub = new TokenIssuerServiceStub();
    const sut = new CreateUserController(
      createUserStub,
      createUserValidatorStub,
      tokenIssuerServiceStub,
    );
    const createUserSpy = vi.spyOn(createUserStub, "execute");
    const createUserValidatorSpy = vi.spyOn(createUserValidatorStub, "execute");
    return {
      sut,
      createUserStub,
      createUserSpy,
      createUserValidatorStub,
      createUserValidatorSpy,
      tokenIssuerServiceStub,
    };
  };

  describe("Core", () => {
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

    it("Should rethrow on unexpected error", async () => {
      const { sut, createUserSpy } = makeSut();
      createUserSpy.mockRejectedValueOnce(new Error("any_error"));
      const dummyRequest = {
        body: {
          name: "any_name",
          email: "any_email@mail.com",
          password: "any_password",
        },
      };

      const httpResponsePromise = sut.handle(dummyRequest);

      await expect(httpResponsePromise).rejects.toThrow();
    });

    it("Should return 409 when email is already in use", async () => {
      const { sut, createUserSpy } = makeSut();
      createUserSpy.mockRejectedValueOnce(new AppError("EMAIL_TAKEN"));
      const dummyRequest = {
        body: {
          name: "any_name",
          email: "taken_email@mail.com",
          password: "any_password",
        },
      };

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(409);
      expect(httpResponse.body.message).toEqual("Email already in use");
    });
  });

  it("Should issue login credentials after successful creation", async () => {
    const { sut, tokenIssuerServiceStub } = makeSut();
    const tokenIssuerSpy = vi.spyOn(tokenIssuerServiceStub, "execute");
    const dummyRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      },
    };

    await sut.handle(dummyRequest);

    expect(tokenIssuerSpy).toHaveBeenCalledTimes(1);
    expect(tokenIssuerSpy).toHaveBeenCalledWith({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      created_at: new Date(),
    });
  });

  it("Should return a logged user without password on success", async () => {
    const { sut } = makeSut();
    const dummyRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      },
    };

    const response = await sut.handle(dummyRequest);

    expect(response.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      created_at: new Date(),
      tokens: {
        accessToken: "access_token",
        refreshToken: "refresh_token",
      },
    });
    expect(
      (response.body as { password_hash?: unknown }).password_hash,
    ).toBeUndefined();
  });

  describe("Validations", () => {
    it("Should return 400 if body is missing", async () => {
      const { sut, createUserValidatorSpy } = makeSut();
      const dummyRequest = {};
      createUserValidatorSpy.mockImplementationOnce(() => {
        throw new AppError("MISSING_BODY");
      });

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(400);
      expect(httpResponse.body.message).toEqual("Missing request body");
    });

    it("Should return 400 if name is missing", async () => {
      const { sut, createUserValidatorSpy } = makeSut();
      const dummyRequest = {
        body: {
          email: "valid_email@mail.com",
          password: "valid_password",
        },
      };

      createUserValidatorSpy.mockImplementationOnce(() => {
        throw new AppError("MISSING_PARAM", "name");
      });

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(400);
      expect(httpResponse.body.message).toEqual("Missing Param: name");
    });

    it("Should return 400 if email is missing", async () => {
      const { sut, createUserValidatorSpy } = makeSut();
      const dummyRequest = {
        body: {
          name: "valid_name",
          password: "valid_password",
        },
      };
      createUserValidatorSpy.mockImplementationOnce(() => {
        throw new AppError("MISSING_PARAM", "email");
      });

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(400);
      expect(httpResponse.body.message).toEqual("Missing Param: email");
    });

    it("Should return 400 if password is missing", async () => {
      const { sut, createUserValidatorSpy } = makeSut();
      const dummyRequest = {
        body: {
          name: "valid_name",
          email: "valid_email@mail.com",
        },
      };
      createUserValidatorSpy.mockImplementationOnce(() => {
        throw new AppError("MISSING_PARAM", "password");
      });

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(400);
      expect(httpResponse.body.message).toEqual("Missing Param: password");
    });

    it("Should return 400 if email is invalid", async () => {
      const { sut, createUserValidatorSpy } = makeSut();
      const dummyRequest = {
        body: {
          name: "valid_name",
          email: "invalid_email",
          password: "valid_password",
        },
      };
      createUserValidatorSpy.mockImplementationOnce(() => {
        throw new AppError("INVALID_PARAM", "email");
      });

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(400);
      expect(httpResponse.body.message).toEqual("Invalid Param: email");
    });

    it("Should return 400 if password is less than 6 char", async () => {
      const { sut, createUserValidatorSpy } = makeSut();
      const dummyRequest = {
        body: {
          name: "valid_name",
          email: "valid_email@mail.com",
          password: "123",
        },
      };
      createUserValidatorSpy.mockImplementationOnce(() => {
        throw new AppError("WEAK_PASSWORD");
      });

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(400);
      expect(httpResponse.body.message).toEqual(
        "Invalid Param: <password> should be at least 6 characters long",
      );
    });

    it("Should return 400 if name is less than 3 char", async () => {
      const { sut, createUserValidatorSpy } = makeSut();
      const dummyRequest = {
        body: {
          name: "ab",
          email: "valid_email@mail.com",
          password: "valid_password",
        },
      };
      createUserValidatorSpy.mockImplementationOnce(() => {
        throw new AppError("INVALID_NAME");
      });

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(400);
      expect(httpResponse.body.message).toEqual(
        "Invalid Param: <name> should be at least 3 characters long",
      );
    });
  });
});
