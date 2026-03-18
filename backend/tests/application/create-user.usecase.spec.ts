import { AppError } from "@application/errors/app-error";
import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { describe, vi, it, expect } from "vitest";
import { HasherStub } from "./doubles/hasher.stub";
import { CreateUserRepositoryStub } from "./doubles/create-user.repository.stub";
import { AuthIdentityRepositoryStub } from "./doubles/auth-identity.repository.stub";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";
import { FIXED_DATE } from "../config/constants";

describe("CreateUserUseCase", () => {
  const makeSut = () => {
    const hasherStub = new HasherStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const authIdentityRepositoryStub = new AuthIdentityRepositoryStub();
    const unitOfWorkStub = new UnitOfWorkStub();
    const sut = new CreateUserUseCase(
      hasherStub,
      createUserRepositoryStub,
      authIdentityRepositoryStub,
      unitOfWorkStub,
    );
    const authIdentityRepositorySpy = vi.spyOn(
      authIdentityRepositoryStub,
      "create",
    );
    const findByProviderAndIdentifierSpy = vi.spyOn(
      authIdentityRepositoryStub,
      "findByProviderAndIdentifier",
    );
    const unitOfWorkExecuteSpy = vi.spyOn(unitOfWorkStub, "execute");
    return {
      sut,
      hasherStub,
      createUserRepositoryStub,
      authIdentityRepositorySpy,
      findByProviderAndIdentifierSpy,
      unitOfWorkExecuteSpy,
    };
  };

  const userDTO = {
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  };

  it("Should throw if local auth identity already exists", async () => {
    const { sut, findByProviderAndIdentifierSpy } = makeSut();
    findByProviderAndIdentifierSpy.mockResolvedValueOnce({
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider: "local",
      identifier: userDTO.email,
      password_hash: "hashed_valid_password",
      provider_user_id: null,
      created_at: FIXED_DATE,
    });
    const newUserPromise = sut.execute(userDTO);
    await expect(newUserPromise).rejects.toThrow(new AppError("EMAIL_TAKEN"));
  });

  it("Should call Hasher with correct password", async () => {
    const { hasherStub, sut } = makeSut();
    const hashPasswordSpy = vi.spyOn(hasherStub, "hash");
    await sut.execute(userDTO);
    expect(hashPasswordSpy).toHaveBeenCalledWith(userDTO.password);
  });

  it("Should look for existing local identifier with correct values", async () => {
    const { sut, findByProviderAndIdentifierSpy } = makeSut();
    await sut.execute(userDTO);
    expect(findByProviderAndIdentifierSpy).toHaveBeenCalledWith(
      "local",
      userDTO.email,
    );
  });

  it("Should call CreateUserRepository with correct values", async () => {
    const { createUserRepositoryStub, sut } = makeSut();
    const createUserRepositorySpy = vi.spyOn(
      createUserRepositoryStub,
      "create",
    );
    await sut.execute(userDTO);
    expect(createUserRepositorySpy).toHaveBeenCalledWith(
      {
        name: userDTO.name,
        email: userDTO.email,
        displayName: userDTO.name,
        bio: expect.any(String),
      },
      expect.any(Object),
    );
  });

  it("Should call AuthIdentityRepository with correct values", async () => {
    const { sut, authIdentityRepositorySpy } = makeSut();
    await sut.execute(userDTO);
    expect(authIdentityRepositorySpy).toHaveBeenCalledWith(
      {
        user_id: "any_id",
        provider: "local",
        identifier: userDTO.email,
        password_hash: "hashed_valid_password",
        provider_user_id: null,
      },
      expect.any(Object),
    );
  });

  it("Should execute user creation inside an UnitOfWork", async () => {
    const { sut, unitOfWorkExecuteSpy } = makeSut();
    await sut.execute(userDTO);
    expect(unitOfWorkExecuteSpy).toHaveBeenCalledTimes(1);
  });

  it("Should return a User on success", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(userDTO);
    expect(result.id).toEqual("any_id");
    expect(result.name).toEqual(userDTO.name);
    expect(result.displayName).toEqual(userDTO.name);
    expect(result.email).toEqual(userDTO.email);
    expect(result.createdAt).toEqual(FIXED_DATE);
  });

  it("Should rethrow if AuthIdentityRepository lookup throws", async () => {
    const { findByProviderAndIdentifierSpy, sut } = makeSut();
    findByProviderAndIdentifierSpy.mockRejectedValueOnce(new Error());
    await expect(sut.execute(userDTO)).rejects.toThrow(new Error());
  });

  it("Should rethrow if AuthIdentityRepository throws", async () => {
    const { sut, authIdentityRepositorySpy } = makeSut();
    authIdentityRepositorySpy.mockRejectedValueOnce(new Error("any_error"));
    await expect(sut.execute(userDTO)).rejects.toThrow(new Error("any_error"));
  });
});
