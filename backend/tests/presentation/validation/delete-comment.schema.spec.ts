import type { DeleteCommentDTO } from "@domain/usecases/delete-comment.contract";
import { AppError } from "@application/errors/app-error";
import { deleteCommentSchema } from "@presentation/validation/delete-comment.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator DeleteComment", () => {
  const sut = new ZodHttpValidator<DeleteCommentDTO>(deleteCommentSchema);
  const validPostId = crypto.randomUUID();
  const validCommentId = crypto.randomUUID();

  const makeRequest = (
    postId = validPostId as string,
    commentId = validCommentId as string,
  ) => {
    return {
      params: {
        id: postId,
        commentId,
      },
      user: {
        sub: "valid_user_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };
  };

  it("Should return a DeleteCommentDTO when validating a valid request", () => {
    const request = makeRequest();
    const result = sut.execute(request);

    expect(result).toEqual({
      post_id: validPostId,
      comment_id: validCommentId,
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

  it("Should throw an AppError if params.commentId is missing", () => {
    const request = {
      params: {
        id: validPostId,
      },
      user: {
        sub: "valid_user_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "commentId"),
    );
  });

  it("Should throw an AppError if params.commentId is invalid", () => {
    const request = makeRequest(validPostId, "invalid_comment_id");

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "commentId"),
    );
  });

  it("Should throw an AppError if user is missing", () => {
    const request = {
      params: {
        id: validPostId,
        commentId: validCommentId,
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "user"),
    );
  });
});
