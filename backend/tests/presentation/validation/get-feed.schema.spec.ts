import type { GetFeedDTO } from "@domain/usecases/get-feed.contract";
import { AppError } from "@application/errors/app-error";
import { getFeedSchema } from "@presentation/validation/get-feed.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator GetFeed", () => {
  const sut = new ZodHttpValidator<GetFeedDTO>(getFeedSchema);
  const validCursorId = crypto.randomUUID();
  const validCursorDate = new Date().toISOString();

  const makeRequest = (
    request?: Partial<{
      query: {
        cursor?: string;
        limit?: string | number;
      };
      user: {
        sub?: string;
        name?: string;
        email?: string;
      };
    }>,
  ) => {
    return {
      query: {
        cursor: `${validCursorDate}|${validCursorId}`,
        limit: "15",
        ...request?.query,
      },
      user: {
        sub: "valid_viewer_id",
        name: "any_name",
        email: "any_email@mail.com",
        ...request?.user,
      },
    };
  };

  it("Should return a GetFeedDTO when validating a valid request", () => {
    const request = makeRequest();
    const result = sut.execute(request);

    expect(result).toEqual({
      viewer_id: "valid_viewer_id",
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
      viewer_id: "valid_viewer_id",
      cursor: undefined,
      limit: 20,
    });
  });

  it("Should return undefined viewer_id when user is missing", () => {
    const request = {
      ...makeRequest(),
      user: undefined,
    };
    const result = sut.execute(request);

    expect(result.viewer_id).toBeUndefined();
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
