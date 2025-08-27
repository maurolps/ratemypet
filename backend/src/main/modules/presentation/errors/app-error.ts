export class AppError extends Error {
  readonly isAppError = true;
  constructor(public readonly code: string) {
    super(code);
    this.name = "AppError";
  }
}

export const isAppError = (err: unknown): err is AppError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "isAppError" in err &&
    (err as { isAppError?: unknown }).isAppError === true
  );
};
