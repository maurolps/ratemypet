import { describe, expect, it } from "vitest";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { AppError } from "@application/errors/app-error";

describe("Error Presenter", () => {
  it("Should return status 429 if error code is limit exceeded", () => {
    const response = ErrorPresenter(new AppError("RATE_LIMIT_EXCEEDED"));
    expect(response.status).toBe(429);
    expect(response.body.name).toEqual("RateLimitExceeded");
  });

  it("Should return 422 if error code is unprocessable entity", () => {
    const response = ErrorPresenter(
      new AppError("UNPROCESSABLE_ENTITY", "any_detail"),
    );
    expect(response.status).toBe(422);
    expect(response.body.name).toEqual("UnprocessableEntity");
  });
});
