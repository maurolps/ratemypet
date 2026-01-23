import type { CreatePostDTO } from "@domain/usecases/create-post.contract";
import { AppError } from "@application/errors/app-error";
import { createPostSchema } from "@presentation/validation/create-post.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator CreatePost", () => {
  const sut = new ZodHttpValidator<CreatePostDTO>(createPostSchema);
  const makeRequest = (
    overrides: Partial<{
      body: Partial<CreatePostDTO>;
    }>,
  ) => {
    return {
      body: {
        pet_id: "valid_pet_id",
        caption: "valid_caption",
        ...overrides.body,
      },
      user: {
        sub: "valid_author_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };
  };

  it("Should return a CreatePostDTO when validating a valid request", () => {
    const request = makeRequest({});
    const result = sut.execute(request);
    expect(result).toEqual({
      pet_id: "valid_pet_id",
      author_id: "valid_author_id",
      caption: "valid_caption",
    });
  });

  it("Should throw an AppError if body is missing", () => {
    const request = {};
    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_BODY"),
    );
  });

  it("Should throw an AppError if pet_id is invalid", () => {
    const request = makeRequest({ body: { pet_id: "   " } });
    const result = () => sut.execute(request);
    expect(result).toThrowError(new AppError("INVALID_PARAM", "pet_id"));
  });

  it("Should throw an AppError if caption is too short", () => {
    const request = makeRequest({ body: { caption: "ab" } });
    const result = () => sut.execute(request);
    expect(result).toThrowError(new AppError("INVALID_PARAM", "caption"));
  });

  it("Should throw an AppError if caption is too long", () => {
    const longCaption = "a".repeat(281);
    const request = makeRequest({ body: { caption: longCaption } });
    const result = () => sut.execute(request);
    expect(result).toThrowError(new AppError("INVALID_PARAM", "caption"));
  });

  it("Should normalize and sanitize the caption field", () => {
    const request = makeRequest({ body: { caption: " Valid   Caption\t\n " } });
    const result = sut.execute(request);
    expect(result.caption).toEqual("Valid Caption");
  });

  it("Should return an empty caption when it is not provided", () => {
    const request = makeRequest({ body: { caption: undefined } });
    const result = sut.execute(request);
    expect(result.caption).toEqual("");
  });
});
