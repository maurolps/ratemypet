import { AppError } from "@application/errors/app-error";
import { GoogleAuthController } from "@presentation/controllers/google-auth.controller";
import { describe, expect, it, vi } from "vitest";
import { GoogleAuthUseCaseStub } from "./doubles/google-auth.usecase.stub";
import { GoogleAuthValidatorStub } from "./doubles/google-auth.validator.stub";

describe("GoogleAuthController", () => {
  const makeSut = () => {
    const googleAuthValidatorStub = new GoogleAuthValidatorStub();
    const googleAuthUseCaseStub = new GoogleAuthUseCaseStub();
    const googleAuthValidatorSpy = vi.spyOn(googleAuthValidatorStub, "execute");
    const googleAuthUseCaseSpy = vi.spyOn(googleAuthUseCaseStub, "auth");
    const sut = new GoogleAuthController(
      googleAuthValidatorStub,
      googleAuthUseCaseStub,
    );

    return {
      sut,
      googleAuthValidatorSpy,
      googleAuthUseCaseSpy,
    };
  };

  const dummyRequest = {
    body: {
      id_token: "valid_google_id_token",
    },
  };

  it("Should return 200 on successful Google auth", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(200);
  });

  it("Should call HttpValidator with correct values", async () => {
    const { sut, googleAuthValidatorSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(googleAuthValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should return 400 if body is missing", async () => {
    const { sut, googleAuthValidatorSpy } = makeSut();
    googleAuthValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("MISSING_BODY");
    });
    const httpResponse = await sut.handle({});
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Missing request body");
  });

  it("Should call GoogleAuthUseCase with correct values", async () => {
    const { sut, googleAuthUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(googleAuthUseCaseSpy).toHaveBeenCalledWith(dummyRequest.body);
  });

  it("Should return logged user with tokens on successful Google auth", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.body).toHaveProperty("id");
    expect(httpResponse.body).toHaveProperty("name");
    expect(httpResponse.body).toHaveProperty("email");
    expect(httpResponse.body).toHaveProperty("picture");
    expect(httpResponse.body).toHaveProperty("tokens");
  });
});
