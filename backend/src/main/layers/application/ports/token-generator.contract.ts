export interface TokenGenerator<T = void> {
  issue(payload?: T): Promise<string>;
}
