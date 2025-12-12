import { describe, expect, it } from "vitest";
import { AppError } from "@application/errors/app-error";
import { AuthMiddleware } from "@presentation/middlewares/auth-middleware";

describe("AuthMiddleware", () => {
  const makeSut = () => {
    const sut = new AuthMiddleware();
    return { sut };
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
});
