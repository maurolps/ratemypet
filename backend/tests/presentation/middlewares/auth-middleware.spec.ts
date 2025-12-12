import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { AuthMiddleware } from "@presentation/middlewares/auth-middleware";
import { AccessTokenGeneratorStub } from "../../application/doubles/token-generator.stub";

describe("AuthMiddleware", () => {
  const makeSut = () => {
    const accessTokenGeneratorStub = new AccessTokenGeneratorStub();
    const accessTokenGeneratorSpy = vi.spyOn(
      accessTokenGeneratorStub,
      "verify",
    );
    const sut = new AuthMiddleware(accessTokenGeneratorStub);
    return { sut, accessTokenGeneratorSpy };
  };

  it("Should throw MISSING_PARAM if authorization header is missing", async () => {
    const { sut } = makeSut();
    const dummyRequest = {
      headers: {},
    };
    await expect(sut.handle(dummyRequest)).rejects.toEqual(
      new AppError(
        "MISSING_PARAM",
        "Authorization header is missing or malformed",
      ),
    );
  });

  it("Should throw MISSING_PARAM if authorization header is malformed", async () => {
    const { sut } = makeSut();
    const dummyRequest = {
      headers: {
        authorization: "InvalidHeader",
      },
    };
    await expect(sut.handle(dummyRequest)).rejects.toEqual(
      new AppError(
        "MISSING_PARAM",
        "Authorization header is missing or malformed",
      ),
    );
  });

  it("Should call AccessTokenGenerator.verify with correct values", async () => {
    const { sut, accessTokenGeneratorSpy } = makeSut();
    const dummyRequest = {
      headers: {
        authorization: "Bearer valid_token",
      },
    };
    await sut.handle(dummyRequest);
    expect(accessTokenGeneratorSpy).toHaveBeenCalledWith("valid_token");
  });
});
