import { AppError } from "@application/errors/app-error";
import { GoogleAuthUseCase } from "@application/usecases/google-auth.usecase";
import { describe, expect, it, vi } from "vitest";
import { AuthIdentityRepositoryStub } from "./doubles/auth-identity.repository.stub";
import { CreateUserRepositoryStub } from "./doubles/create-user.repository.stub";
import { FindUserRepositoryStub } from "./doubles/find-user.repository.stub";
import { GoogleTokenVerifierStub } from "./doubles/google-token-verifier.stub";
import { TokenIssuerServiceStub } from "./doubles/token-issuer.service.stub";
import { UnitOfWorkStub } from "./doubles/unit-of-work.stub";
import { FIXED_DATE } from "../config/constants";

describe("GoogleAuthUseCase", () => {
  const makeSut = () => {
    const googleTokenVerifierStub = new GoogleTokenVerifierStub();
    const findUserRepositoryStub = new FindUserRepositoryStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const authIdentityRepositoryStub = new AuthIdentityRepositoryStub();
    const tokenIssuerStub = new TokenIssuerServiceStub();
    const unitOfWorkStub = new UnitOfWorkStub();

    const googleTokenVerifierSpy = vi.spyOn(googleTokenVerifierStub, "verify");
    const findUserByIdSpy = vi.spyOn(findUserRepositoryStub, "findById");
    const createUserRepositorySpy = vi.spyOn(
      createUserRepositoryStub,
      "create",
    );
    const findByProviderUserIdSpy = vi.spyOn(
      authIdentityRepositoryStub,
      "findByProviderUserId",
    );
    const authIdentityRepositoryCreateSpy = vi.spyOn(
      authIdentityRepositoryStub,
      "create",
    );
    const tokenIssuerSpy = vi.spyOn(tokenIssuerStub, "execute");
    const unitOfWorkExecuteSpy = vi.spyOn(unitOfWorkStub, "execute");

    const sut = new GoogleAuthUseCase(
      googleTokenVerifierStub,
      findUserRepositoryStub,
      createUserRepositoryStub,
      authIdentityRepositoryStub,
      tokenIssuerStub,
      unitOfWorkStub,
    );

    return {
      sut,
      googleTokenVerifierSpy,
      findUserByIdSpy,
      createUserRepositorySpy,
      findByProviderUserIdSpy,
      authIdentityRepositoryCreateSpy,
      tokenIssuerSpy,
      unitOfWorkExecuteSpy,
    };
  };

  const googleAuthDTO = {
    id_token: "valid_google_id_token",
  };

  it("Should call GoogleTokenVerifier with correct values", async () => {
    const { sut, googleTokenVerifierSpy } = makeSut();

    await sut.auth(googleAuthDTO);

    expect(googleTokenVerifierSpy).toHaveBeenCalledWith(googleAuthDTO.id_token);
  });

  it("Should throw UNAUTHORIZED when GoogleTokenVerifier throws", async () => {
    const { sut, googleTokenVerifierSpy } = makeSut();
    googleTokenVerifierSpy.mockRejectedValueOnce(new Error("invalid_token"));

    await expect(sut.auth(googleAuthDTO)).rejects.toThrow(
      new AppError("UNAUTHORIZED"),
    );
  });

  it("Should throw UNAUTHORIZED when email is not verified", async () => {
    const { sut, googleTokenVerifierSpy } = makeSut();
    googleTokenVerifierSpy.mockResolvedValueOnce({
      sub: "google_sub_123",
      email: "google_user@mail.com",
      name: "Google User",
      picture: "https://valid.picture/google.png",
      email_verified: false,
    });

    await expect(sut.auth(googleAuthDTO)).rejects.toThrow(
      new AppError("UNAUTHORIZED"),
    );
  });

  it("Should lookup auth identity by provider_user_id", async () => {
    const { sut, findByProviderUserIdSpy } = makeSut();

    await sut.auth(googleAuthDTO);

    expect(findByProviderUserIdSpy).toHaveBeenCalledWith(
      "google",
      "google_sub_123",
    );
  });

  it("Should create user and auth identity when Google auth identity does not exist", async () => {
    const {
      sut,
      createUserRepositorySpy,
      findByProviderUserIdSpy,
      authIdentityRepositoryCreateSpy,
      unitOfWorkExecuteSpy,
    } = makeSut();
    findByProviderUserIdSpy.mockResolvedValueOnce(null);

    await sut.auth(googleAuthDTO);

    expect(unitOfWorkExecuteSpy).toHaveBeenCalledTimes(1);
    expect(createUserRepositorySpy).toHaveBeenCalledWith(
      {
        name: "Google User",
        email: "google_user@mail.com",
        picture: "https://valid.picture/google.png",
        display_name: "Google User",
        bio: expect.any(String),
      },
      expect.any(Object),
    );
    expect(authIdentityRepositoryCreateSpy).toHaveBeenCalledWith(
      {
        user_id: "any_id",
        provider: "google",
        identifier: "google_user@mail.com",
        provider_user_id: "google_sub_123",
        password_hash: null,
      },
      expect.any(Object),
    );
  });

  it("Should authenticate an existing Google user without creating a new user", async () => {
    const { sut, findByProviderUserIdSpy, createUserRepositorySpy } = makeSut();
    findByProviderUserIdSpy.mockResolvedValueOnce({
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider: "google",
      identifier: "google_user@mail.com",
      password_hash: null,
      provider_user_id: "google_sub_123",
      created_at: FIXED_DATE,
    });

    const loggedUser = await sut.auth(googleAuthDTO);

    expect(createUserRepositorySpy).not.toHaveBeenCalled();
    expect(loggedUser.id).toEqual("valid_user_id");
  });

  it("Should load the user by identity user_id", async () => {
    const { sut, findByProviderUserIdSpy, findUserByIdSpy } = makeSut();
    findByProviderUserIdSpy.mockResolvedValueOnce({
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider: "google",
      identifier: "google_user@mail.com",
      password_hash: null,
      provider_user_id: "google_sub_123",
      created_at: FIXED_DATE,
    });

    await sut.auth(googleAuthDTO);

    expect(findUserByIdSpy).toHaveBeenCalledWith("valid_user_id");
  });

  it("Should throw UNAUTHORIZED when an existing identity points to a missing user", async () => {
    const { sut, findByProviderUserIdSpy, findUserByIdSpy } = makeSut();
    findByProviderUserIdSpy.mockResolvedValueOnce({
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider: "google",
      identifier: "google_user@mail.com",
      password_hash: null,
      provider_user_id: "google_sub_123",
      created_at: FIXED_DATE,
    });
    findUserByIdSpy.mockResolvedValueOnce(null);

    await expect(sut.auth(googleAuthDTO)).rejects.toThrow(
      new AppError("UNAUTHORIZED"),
    );
  });

  it("Should call TokenIssuer with the authenticated user", async () => {
    const { sut, tokenIssuerSpy, findByProviderUserIdSpy } = makeSut();
    findByProviderUserIdSpy.mockResolvedValueOnce(null);

    await sut.auth(googleAuthDTO);

    expect(tokenIssuerSpy).toHaveBeenCalledWith({
      id: "any_id",
      name: "Google User",
      email: "google_user@mail.com",
      picture: "https://valid.picture/google.png",
      created_at: FIXED_DATE,
    });
  });

  it("Should return logged user with tokens on success", async () => {
    const { sut, findByProviderUserIdSpy } = makeSut();
    findByProviderUserIdSpy.mockResolvedValueOnce(null);

    const loggedUser = await sut.auth(googleAuthDTO);

    expect(loggedUser).toEqual({
      id: "any_id",
      name: "Google User",
      email: "google_user@mail.com",
      picture: "https://valid.picture/google.png",
      created_at: FIXED_DATE,
      tokens: {
        accessToken: "access_token",
        refreshToken: "refresh_token",
      },
    });
  });
});
