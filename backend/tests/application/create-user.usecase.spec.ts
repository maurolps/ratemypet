import { AppError } from "@presentation/errors/app-error";
import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { describe, it, expect } from "vitest";

describe("CreateUserUseCase", () => {
  it("Should throw if user already exists", async () => {
    const findUserByEmailRepositoryStub = new FindUserByEmailRepositoryStub();
    const sut = new CreateUserUseCase(findUserByEmailRepositoryStub);
    const userDTO = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const newUserPromise = sut.execute(userDTO);

    await expect(newUserPromise).rejects.toThrow(new AppError("EMAIL_TAKEN"));
  });
});
