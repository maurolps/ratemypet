export class DomainError extends Error {
  readonly isDomainError = true;
  constructor(public readonly code: string) {
    super(code);
    this.name = "DomainError";
  }
}

export const isDomainError = (err: unknown): err is DomainError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "isDomainError" in err &&
    (err as { isDomainError?: unknown }).isDomainError === true
  );
};
