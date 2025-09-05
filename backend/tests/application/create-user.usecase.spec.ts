import { AppError } from "@presentation/errors/app-error";
import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { describe, vi, it, expect } from "vitest";

interface Hasher {
  execute(password: string): string;
}

class HashPasswordStub implements Hasher {
  execute(password: string): string {
    return `hashed_${password}`;
  }
}

describe("CreateUserUseCase", () => {
  it("Should throw if user already exists", async () => {
    const findUserByEmailRepositoryStub = new FindUserByEmailRepositoryStub();
    const hashPasswordStub = new HashPasswordStub();
    const findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryStub,
      "perform",
    );
    const sut = new CreateUserUseCase(
      findUserByEmailRepositoryStub,
      hashPasswordStub,
    );
    const userDTO = {
      name: "valid_name",
      email: "taken_email@mail.com",
      password: "valid_password",
    };
    const fakeUser = {
      id: "valid_id",
      ...userDTO,
    };
    findUserByEmailRepositorySpy.mockResolvedValueOnce(fakeUser);

    const newUserPromise = sut.execute(userDTO);

    await expect(newUserPromise).rejects.toThrow(new AppError("EMAIL_TAKEN"));
  });

  it("Should call Hasher with correct password", async () => {
    const findUserByEmailRepositoryStub = new FindUserByEmailRepositoryStub();
    const hashPasswordStub = new HashPasswordStub();
    const sut = new CreateUserUseCase(
      findUserByEmailRepositoryStub,
      hashPasswordStub,
    );
    const hashPasswordSpy = vi.spyOn(hashPasswordStub, "execute");
    const UserDTO = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.execute(UserDTO);

    expect(hashPasswordSpy).toHaveBeenCalledWith(UserDTO.password);
  });
});
