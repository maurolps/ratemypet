export interface Hasher {
  execute(plainPassword: string): Promise<string>;
}
