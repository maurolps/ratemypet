import { AppError } from "@application/errors/app-error";
import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { describe, vi, it, expect } from "vitest";
import { FindUserRepositoryStub } from "./doubles/find-user.repository.stub";
import { HasherStub } from "./doubles/hasher.stub";
import { CreateUserRepositoryStub } from "./doubles/create-user.repository.stub";
import { AuthIdentityRepositoryStub } from "./doubles/auth-identity.repository.stub";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";

describe("CreateUserUseCase", () => {
  const makeSut = () => {
    const findUserRepositoryStub = new FindUserRepositoryStub();
    const findUserRepositorySpy = vi.spyOn(
      findUserRepositoryStub,
      "findByEmail",
    );
    const hasherStub = new HasherStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const authIdentityRepositoryStub = new AuthIdentityRepositoryStub();
    const unitOfWorkStub = new UnitOfWorkStub();
    const sut = new CreateUserUseCase(
      findUserRepositoryStub,
      hasherStub,
      createUserRepositoryStub,
      authIdentityRepositoryStub,
      unitOfWorkStub,
    );
    const authIdentityRepositorySpy = vi.spyOn(
      authIdentityRepositoryStub,
      "create",
    );
    const unitOfWorkExecuteSpy = vi.spyOn(unitOfWorkStub, "execute");
    return {
      sut,
      findUserRepositorySpy,
      hasherStub,
      createUserRepositoryStub,
      authIdentityRepositorySpy,
      unitOfWorkExecuteSpy,
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
    await sut.execute(userDTO);
    expect(createUserRepositorySpy).toHaveBeenCalledWith(
      {
        name: userDTO.name,
        email: userDTO.email,
      },
      expect.any(Object),
    );
  });

  it("Should call AuthIdentityRepository with correct values", async () => {
    const { sut, findUserRepositorySpy, authIdentityRepositorySpy } = makeSut();
    findUserRepositorySpy.mockImplementationOnce(() => Promise.resolve(null));
    await sut.execute(userDTO);
    expect(authIdentityRepositorySpy).toHaveBeenCalledWith(
      {
        user_id: "any_id",
        provider: "local",
        password_hash: "hashed_valid_password",
        provider_user_id: null,
      },
      expect.any(Object),
    );
  });

  it("Should execute user creation inside an UnitOfWork", async () => {
    const { sut, findUserRepositorySpy, unitOfWorkExecuteSpy } = makeSut();
    findUserRepositorySpy.mockImplementationOnce(() => Promise.resolve(null));
    await sut.execute(userDTO);
    expect(unitOfWorkExecuteSpy).toHaveBeenCalledTimes(1);
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

  it("Should rethrow if AuthIdentityRepository throws", async () => {
    const { sut, findUserRepositorySpy, authIdentityRepositorySpy } = makeSut();
    findUserRepositorySpy.mockImplementationOnce(() => Promise.resolve(null));
    authIdentityRepositorySpy.mockRejectedValueOnce(new Error("any_error"));
    await expect(sut.execute(userDTO)).rejects.toThrow(new Error("any_error"));
  });
});
