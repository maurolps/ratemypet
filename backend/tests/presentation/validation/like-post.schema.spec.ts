import type { LikePostDTO } from "@domain/usecases/like-post.contract";
import { AppError } from "@application/errors/app-error";
import { likePostSchema } from "@presentation/validation/like-post.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator LikePost", () => {
  const sut = new ZodHttpValidator<LikePostDTO>(likePostSchema);

  const makeRequest = (id = "valid_post_id") => {
    return {
      params: {
        id,
      },
      user: {
        sub: "valid_user_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };
  };

  it("Should return a LikePostDTO when validating a valid request", () => {
    const request = makeRequest();
    const result = sut.execute(request);
    expect(result).toEqual({
      post_id: "valid_post_id",
      user_id: "valid_user_id",
    });
  });

  it("Should throw an AppError if params is missing", () => {
    const request = {
      user: {
        sub: "valid_user_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "params"),
    );
  });

  it("Should throw an AppError if params.id is missing", () => {
    const request = {
      params: {},
      user: {
        sub: "valid_user_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "id"),
    );
  });

  it("Should throw an AppError if params.id is blank", () => {
    const request = makeRequest("   ");

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "id"),
    );
  });
});
