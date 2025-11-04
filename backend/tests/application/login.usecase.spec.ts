import { LoginUseCase } from "@application/usecases/login.usecase";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { describe, expect, it } from "vitest";
import { AppError } from "@application/errors/app-error";

describe("LoginUseCase", () => {
  it("Should throw UNAUTHORIZED error when user is not found", async () => {
    const loginDTO = {
      email: "non_exists@mail.com",
      password: "any_password",
    };
    const findUserByEmail = new FindUserByEmailRepositoryStub();
    const sut = new LoginUseCase(findUserByEmail);
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });
});
