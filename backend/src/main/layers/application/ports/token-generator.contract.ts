export interface TokenGenerator<T> {
  issue(payload: T): Promise<string>;
}
