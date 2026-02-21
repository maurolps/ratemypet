import type { ListCommentsDTO } from "@domain/usecases/list-comments.contract";
import { AppError } from "@application/errors/app-error";
import { listCommentsSchema } from "@presentation/validation/list-comments.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator ListComments", () => {
  const sut = new ZodHttpValidator<ListCommentsDTO>(listCommentsSchema);
  const validPostId = crypto.randomUUID();
  const validCursorId = crypto.randomUUID();
  const validCursorDate = new Date().toISOString();

  const makeRequest = (
    request?: Partial<{
      params: {
        id?: string;
      };
      query: {
        cursor?: string;
        limit?: string | number;
      };
    }>,
  ) => {
    return {
      params: {
        id: validPostId,
        ...request?.params,
      },
      query: {
        cursor: `${validCursorDate}|${validCursorId}`,
        limit: "15",
        ...request?.query,
      },
    };
  };

  it("Should return a ListCommentsDTO when validating a valid request", () => {
    const request = makeRequest();
    const result = sut.execute(request);

    expect(result).toEqual({
      post_id: validPostId,
      cursor: {
        created_at: new Date(validCursorDate),
        id: validCursorId,
      },
      limit: 15,
    });
  });

  it("Should use default limit and undefined cursor when query is missing", () => {
    const request = {
      ...makeRequest(),
      query: undefined,
    };
    const result = sut.execute(request);

    expect(result).toEqual({
      post_id: validPostId,
      cursor: undefined,
      limit: 20,
    });
  });

  it("Should throw an AppError if params is missing", () => {
    const request = {
      query: {
        cursor: `${validCursorDate}|${validCursorId}`,
        limit: "15",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "params"),
    );
  });

  it("Should throw an AppError if params.id is missing", () => {
    const request = {
      ...makeRequest(),
      params: {},
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "id"),
    );
  });

  it("Should throw an AppError if params.id is not a valid uuid", () => {
    const request = makeRequest({
      params: {
        id: "invalid_id",
      },
    });

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "id"),
    );
  });

  it("Should throw an AppError if query.cursor is invalid", () => {
    const request = makeRequest({
      query: {
        cursor: "invalid_cursor",
      },
    });

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "cursor"),
    );
  });

  it("Should throw an AppError if query.limit is less than minimum", () => {
    const request = makeRequest({
      query: {
        limit: "0",
      },
    });

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "limit"),
    );
  });

  it("Should throw an AppError if query.limit is greater than maximum", () => {
    const request = makeRequest({
      query: {
        limit: "51",
      },
    });

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "limit"),
    );
  });
});
