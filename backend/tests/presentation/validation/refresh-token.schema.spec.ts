import type { RefreshTokenParsed } from "@domain/usecases/refresh-token.contract";
import { refreshTokenSchema } from "@presentation/validation/refresh-token.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator RefreshToken", () => {
  const sut = new ZodHttpValidator<RefreshTokenParsed>(refreshTokenSchema);

  it("Should return a RefreshTokenParsed when validating a valid request cookies", () => {
    const request = {
      cookies: {
        refreshToken: "valid_id.secret",
      },
    };
    const result = sut.execute(request);
    expect(result).toEqual({
      id: "valid_id",
      secret: "secret",
    });
  });
});
