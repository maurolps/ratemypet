import { AppError } from "@presentation/errors/app-error";
import { CreateUserController } from "@presentation/controllers/create-user.controller";
import { describe, expect, it, vi } from "vitest";
import { CreateUserStub } from "./doubles/create-user.usecase.stub";
import { CreateUserValidatorStub } from "./doubles/create-user.validator.stub";

describe("CreateUserController", () => {
  const makeSut = () => {
    const createUserStub = new CreateUserStub();
    const createUserValidatorStub = new CreateUserValidatorStub();
    const sut = new CreateUserController(
      createUserStub,
      createUserValidatorStub,
    );
    const createUserSpy = vi.spyOn(createUserStub, "execute");
    const createUserValidatorSpy = vi.spyOn(createUserValidatorStub, "execute");
    return {
      sut,
      createUserStub,
      createUserSpy,
      createUserValidatorStub,
      createUserValidatorSpy,
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
          email: "taken_email@mail.com",
          password: "any_password",
        },
      };

      const httpResponse = await sut.handle(dummyRequest);

      expect(httpResponse.status).toBe(409);
      expect(httpResponse.body.message).toEqual("Email already in use");
    });
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
  });
});
