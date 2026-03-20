import type { UpdateProfileDTO } from "@domain/usecases/update-profile.contract";
import { AppError } from "@application/errors/app-error";
import { updateProfileSchema } from "@presentation/validation/update-profile.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator UpdateProfile", () => {
  const sut = new ZodHttpValidator<UpdateProfileDTO>(updateProfileSchema);

  const makeRequest = (
    overrides?: Partial<{
      body: {
        displayName?: string;
        bio?: string;
      };
      user: {
        sub?: string;
        name?: string;
        email?: string;
      };
    }>,
  ) => {
    return {
      body: {
        displayName: "valid_display_name",
        bio: "valid_bio",
        ...overrides?.body,
      },
      user: {
        sub: crypto.randomUUID(),
        name: "valid_name",
        email: "valid_email@mail.com",
        ...overrides?.user,
      },
    };
  };

  it("Should return an UpdateProfileDTO when displayName is the only field provided", () => {
    const request = makeRequest({
      body: {
        displayName: "updated_display_name",
        bio: undefined,
      },
    });

    const result = sut.execute(request);

    expect(result).toEqual({
      user_id: request.user.sub,
      displayName: "updated_display_name",
    });
  });

  it("Should return an UpdateProfileDTO when bio is the only field provided", () => {
    const request = makeRequest({
      body: {
        displayName: undefined,
        bio: "updated_bio",
      },
    });

    const result = sut.execute(request);

    expect(result).toEqual({
      user_id: request.user.sub,
      bio: "updated_bio",
    });
  });

  it("Should return an UpdateProfileDTO when both fields are provided", () => {
    const request = makeRequest({
      body: {
        displayName: "updated_display_name",
        bio: "updated_bio",
      },
    });

    const result = sut.execute(request);

    expect(result).toEqual({
      user_id: request.user.sub,
      displayName: "updated_display_name",
      bio: "updated_bio",
    });
  });

  it("Should normalize and sanitize displayName and bio fields", () => {
    const request = makeRequest({
      body: {
        displayName: " Updated   Display\t\n ",
        bio: " Updated   Bio\t\n ",
      },
    });

    const result = sut.execute(request);

    expect(result).toEqual({
      user_id: request.user.sub,
      displayName: "Updated Display",
      bio: "Updated Bio",
    });
  });

  it("Should throw an AppError if body is missing", () => {
    expect(() =>
      sut.execute({
        user: {
          sub: crypto.randomUUID(),
          name: "valid_name",
          email: "valid_email@mail.com",
        },
      }),
    ).toThrowError(new AppError("MISSING_BODY"));
  });

  it("Should throw an AppError if body has no updatable fields", () => {
    expect(() =>
      sut.execute({
        body: {},
        user: {
          sub: crypto.randomUUID(),
          name: "valid_name",
          email: "valid_email@mail.com",
        },
      }),
    ).toThrowError(new AppError("INVALID_PARAM", "body"));
  });

  it("Should throw an AppError if displayName is too short", () => {
    const request = makeRequest({
      body: {
        displayName: "ab",
      },
    });

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "displayName"),
    );
  });

  it("Should throw an AppError if displayName is too long", () => {
    const request = makeRequest({
      body: {
        displayName: "a".repeat(71),
      },
    });

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "displayName"),
    );
  });

  it("Should throw an AppError if bio is too long", () => {
    const request = makeRequest({
      body: {
        bio: "a".repeat(161),
      },
    });

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "bio"),
    );
  });
});
