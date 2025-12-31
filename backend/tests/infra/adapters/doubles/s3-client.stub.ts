export const s3ClientStub = {
  send: async (_command: unknown) => {},
  // biome-ignore lint: no-explicit-any
} as any;
