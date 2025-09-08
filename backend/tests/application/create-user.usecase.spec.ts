import { AppError } from "@presentation/errors/app-error";
import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { describe, vi, it, expect } from "vitest";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { HashPasswordStub } from "./doubles/hash-password.stub";
import { CreateUserRepositoryStub } from "./doubles/create-user.repository.stub";

describe("CreateUserUseCase", () => {
  const makeSut = () => {
    const findUserByEmailRepositoryStub = new FindUserByEmailRepositoryStub();
    const hashPasswordStub = new HashPasswordStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const sut = new CreateUserUseCase(
      findUserByEmailRepositoryStub,
      hashPasswordStub,
      createUserRepositoryStub,
    );
    return {
      sut,
      findUserByEmailRepositoryStub,
      hashPasswordStub,
      createUserRepositoryStub,
    };
  };

  it("Should throw if user already exists", async () => {
    const { findUserByEmailRepositoryStub, sut } = makeSut();
    const findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryStub,
      "perform",
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
    const { hashPasswordStub, sut } = makeSut();
    const hashPasswordSpy = vi.spyOn(hashPasswordStub, "execute");
    const userDTO = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.execute(userDTO);

    expect(hashPasswordSpy).toHaveBeenCalledWith(userDTO.password);
  });

  it("Should call CreateUserRepository with correct values", async () => {
    const { createUserRepositoryStub, sut } = makeSut();
    const createUserRepositorySpy = vi.spyOn(
      createUserRepositoryStub,
      "perform",
    );
    const userDTO = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const hashedPassword = `hashed_${userDTO.password}`;

    await sut.execute(userDTO);

    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...userDTO,
      password: hashedPassword,
    });
  });
});
