import { AppError } from "@application/errors/app-error";
import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { describe, vi, it, expect } from "vitest";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { HasherStub } from "./doubles/hasher.stub";
import { CreateUserRepositoryStub } from "./doubles/create-user.repository.stub";

describe("CreateUserUseCase", () => {
  const makeSut = () => {
    const findUserByEmailRepositoryStub = new FindUserByEmailRepositoryStub();
    const findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryStub,
      "findByEmail",
    );
    const hasherStub = new HasherStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const sut = new CreateUserUseCase(
      findUserByEmailRepositoryStub,
      hasherStub,
      createUserRepositoryStub,
    );
    return {
      sut,
      findUserByEmailRepositorySpy,
      hasherStub,
      createUserRepositoryStub,
    };
  };

  const userDTO = {
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  };

  it("Should throw if user already exists", async () => {
    const { sut } = makeSut();
    const newUserPromise = sut.execute(userDTO);
    await expect(newUserPromise).rejects.toThrow(new AppError("EMAIL_TAKEN"));
  });

  it("Should call Hasher with correct password", async () => {
    const { hasherStub, sut, findUserByEmailRepositorySpy } = makeSut();
    const hashPasswordSpy = vi.spyOn(hasherStub, "hash");
    findUserByEmailRepositorySpy.mockImplementationOnce(() =>
      Promise.resolve(null),
    );
    await sut.execute(userDTO);
    expect(hashPasswordSpy).toHaveBeenCalledWith(userDTO.password);
  });

  it("Should call CreateUserRepository with correct values", async () => {
    const { createUserRepositoryStub, sut, findUserByEmailRepositorySpy } =
      makeSut();
    const createUserRepositorySpy = vi.spyOn(
      createUserRepositoryStub,
      "create",
    );
    findUserByEmailRepositorySpy.mockImplementationOnce(() =>
      Promise.resolve(null),
    );
    const hashedPassword = `hashed_${userDTO.password}`;
    await sut.execute(userDTO);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...userDTO,
      password: hashedPassword,
    });
  });

  it("Should return a User on success", async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut();
    findUserByEmailRepositorySpy.mockImplementationOnce(() =>
      Promise.resolve(null),
    );
    const result = await sut.execute(userDTO);
    expect(result.id).toEqual("any_id");
    expect(result.name).toEqual(userDTO.name);
    expect(result.email).toEqual(userDTO.email);
  });

  it("Should rethrow if FindUserByEmailRepository throws", async () => {
    const { findUserByEmailRepositorySpy, sut } = makeSut();
    findUserByEmailRepositorySpy.mockRejectedValueOnce(new Error());
    await expect(sut.execute(userDTO)).rejects.toThrow(new Error());
  });
});
