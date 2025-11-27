import { AppError } from "@application/errors/app-error";
import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { describe, vi, it, expect } from "vitest";
import { FindUserRepositoryStub } from "./doubles/find-user.repository.stub";
import { HasherStub } from "./doubles/hasher.stub";
import { CreateUserRepositoryStub } from "./doubles/create-user.repository.stub";

describe("CreateUserUseCase", () => {
  const makeSut = () => {
    const findUserRepositoryStub = new FindUserRepositoryStub();
    const findUserRepositorySpy = vi.spyOn(
      findUserRepositoryStub,
      "findByEmail",
    );
    const hasherStub = new HasherStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const sut = new CreateUserUseCase(
      findUserRepositoryStub,
      hasherStub,
      createUserRepositoryStub,
    );
    return {
      sut,
      findUserRepositorySpy,
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
    const { hasherStub, sut, findUserRepositorySpy } = makeSut();
    const hashPasswordSpy = vi.spyOn(hasherStub, "hash");
    findUserRepositorySpy.mockImplementationOnce(() => Promise.resolve(null));
    await sut.execute(userDTO);
    expect(hashPasswordSpy).toHaveBeenCalledWith(userDTO.password);
  });

  it("Should call CreateUserRepository with correct values", async () => {
    const { createUserRepositoryStub, sut, findUserRepositorySpy } = makeSut();
    const createUserRepositorySpy = vi.spyOn(
      createUserRepositoryStub,
      "create",
    );
    findUserRepositorySpy.mockImplementationOnce(() => Promise.resolve(null));
    const hashedPassword = `hashed_${userDTO.password}`;
    await sut.execute(userDTO);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...userDTO,
      password: hashedPassword,
    });
  });

  it("Should return a User on success", async () => {
    const { sut, findUserRepositorySpy } = makeSut();
    findUserRepositorySpy.mockImplementationOnce(() => Promise.resolve(null));
    const result = await sut.execute(userDTO);
    expect(result.id).toEqual("any_id");
    expect(result.name).toEqual(userDTO.name);
    expect(result.email).toEqual(userDTO.email);
  });

  it("Should rethrow if FindUserRepository throws", async () => {
    const { findUserRepositorySpy, sut } = makeSut();
    findUserRepositorySpy.mockRejectedValueOnce(new Error());
    await expect(sut.execute(userDTO)).rejects.toThrow(new Error());
  });
});
