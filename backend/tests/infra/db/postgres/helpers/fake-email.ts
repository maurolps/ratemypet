export const generateFakeEmail = (prefix: string): string =>
  `${prefix}_${Date.now()}_${crypto.randomUUID()}@mail.com`;
