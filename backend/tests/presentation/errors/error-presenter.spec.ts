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

  it("Should return 403 if error code is forbidden", () => {
    const response = ErrorPresenter(new AppError("FORBIDDEN"));
    expect(response.status).toBe(403);
    expect(response.body.name).toEqual("Forbidden");
  });

  it("Should return 404 if error code is not found", () => {
    const response = ErrorPresenter(new AppError("NOT_FOUND"));
    expect(response.status).toBe(404);
    expect(response.body.name).toEqual("NotFound");
  });
});
