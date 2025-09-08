import { AppError } from "@application/errors/app-error";
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

  const userDTO = {
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  };

  it("Should throw if user already exists", async () => {
    const { findUserByEmailRepositoryStub, sut } = makeSut();
    const findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryStub,
      "perform",
    );
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
    await sut.execute(userDTO);
    expect(hashPasswordSpy).toHaveBeenCalledWith(userDTO.password);
  });

  it("Should call CreateUserRepository with correct values", async () => {
    const { createUserRepositoryStub, sut } = makeSut();
    const createUserRepositorySpy = vi.spyOn(
      createUserRepositoryStub,
      "perform",
    );
    const hashedPassword = `hashed_${userDTO.password}`;
    await sut.execute(userDTO);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...userDTO,
      password: hashedPassword,
    });
  });

  it("Should return a User on success", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(userDTO);
    expect(result).toEqual({
      id: "any_id",
      ...userDTO,
      password: `hashed_${userDTO.password}`,
    });
  });

  it("Should rethrow if FindUserByEmailRepository throws", async () => {
    const { findUserByEmailRepositoryStub, sut } = makeSut();
    const findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryStub,
      "perform",
    );
    findUserByEmailRepositorySpy.mockRejectedValueOnce(new Error());
    await expect(sut.execute(userDTO)).rejects.toThrow(new Error());
  });
});
