import type { DeletePostDTO } from "@domain/usecases/delete-post.contract";
import { AppError } from "@application/errors/app-error";
import { deletePostSchema } from "@presentation/validation/delete-post.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator DeletePost", () => {
  const sut = new ZodHttpValidator<DeletePostDTO>(deletePostSchema);
  const validPostId = crypto.randomUUID();

  const makeRequest = (id = validPostId as string) => {
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

  it("Should return a DeletePostDTO when validating a valid request", () => {
    const request = makeRequest();
    const result = sut.execute(request);

    expect(result).toEqual({
      post_id: validPostId,
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

  it("Should throw an AppError if params.id is invalid", () => {
    const request = makeRequest("invalid_post_id");

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "id"),
    );
  });

  it("Should throw an AppError if user is missing", () => {
    const request = {
      params: {
        id: validPostId,
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "user"),
    );
  });
});
