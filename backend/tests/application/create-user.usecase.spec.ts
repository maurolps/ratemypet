import type { User } from "@domain/entities/user";
import { describe, it, expect } from "vitest";
import { CreateUserUseCase } from "../../src/main/modules/application/usecases/create-user.usecase";
import { AppError } from "@presentation/errors/app-error";

interface FindUserByEmailRepository {
  perform(email: string): Promise<User | null>;
}

class FindUserByEmailRepositoryStub implements FindUserByEmailRepository {
  perform(email: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve({
        id: "valid_id",
        name: "valid_name",
        email,
      }),
    );
  }
}

const findUserByEmailRepositoryStub = new FindUserByEmailRepositoryStub();

describe("CreateUserUseCase", () => {
  it("Should throw if user already exists", async () => {
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
