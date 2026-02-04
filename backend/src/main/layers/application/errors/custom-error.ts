import type { CUSTOM_ERROR_CODE } from "./error-codes";

export class CustomError extends Error {
  readonly isCustomError = true;
  constructor(
    public readonly code: CUSTOM_ERROR_CODE,
    override readonly message: string,
  ) {
    super(code);
    this.name = "CustomError";
  }
}

export const isCustomError = (err: unknown): err is CustomError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "isCustomError" in err &&
    (err as { isCustomError?: unknown }).isCustomError === true
  );
};
