import { describe, expect, it, vi } from "vitest";

const { verifyIdTokenSpy, getPayloadSpy } = vi.hoisted(() => {
  return {
    verifyIdTokenSpy: vi.fn(),
    getPayloadSpy: vi.fn(),
  };
});

vi.mock("google-auth-library", () => {
  return {
    OAuth2Client: vi.fn().mockImplementation(() => ({
      verifyIdToken: verifyIdTokenSpy,
    })),
  };
});

import { GoogleTokenVerifierAdapter } from "@infra/auth/google-token-verifier.adapter";

describe("GoogleTokenVerifierAdapter", () => {
  const makeSut = () => {
    verifyIdTokenSpy.mockResolvedValue({
      getPayload: getPayloadSpy,
    });
    getPayloadSpy.mockReturnValue({
      sub: "google_sub_123",
      email: "Google_user@mail.com",
      name: "Google User",
      picture: "https://valid.picture/google.png",
      email_verified: true,
    });
    const sut = new GoogleTokenVerifierAdapter("valid_google_client_id");

    return sut;
  };

  it("Should call OAuth2Client.verifyIdToken with correct values", async () => {
    const sut = makeSut();

    await sut.verify("valid_google_id_token");

    expect(verifyIdTokenSpy).toHaveBeenCalledWith({
      idToken: "valid_google_id_token",
      audience: "valid_google_client_id",
    });
  });

  it("Should normalize email and return Google identity on success", async () => {
    const sut = makeSut();

    const googleIdentity = await sut.verify("valid_google_id_token");

    expect(googleIdentity).toEqual({
      sub: "google_sub_123",
      email: "google_user@mail.com",
      name: "Google User",
      picture: "https://valid.picture/google.png",
      email_verified: true,
    });
  });

  it("Should throw if verifyIdToken rejects", async () => {
    const sut = makeSut();
    verifyIdTokenSpy.mockRejectedValueOnce(new Error("invalid_token"));

    await expect(sut.verify("invalid_google_id_token")).rejects.toThrow(
      "invalid_token",
    );
  });

  it("Should throw if payload is missing required claims", async () => {
    const sut = makeSut();
    getPayloadSpy.mockReturnValueOnce({
      sub: "google_sub_123",
      email_verified: true,
    });

    await expect(sut.verify("valid_google_id_token")).rejects.toThrow(
      "Invalid Google token payload",
    );
  });
});
