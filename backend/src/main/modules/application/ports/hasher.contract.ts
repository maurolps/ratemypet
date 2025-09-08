export interface Hasher {
  execute(password: string): string;
}
