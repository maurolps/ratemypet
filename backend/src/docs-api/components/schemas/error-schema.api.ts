const errorSchema = {
  type: "object",
  description: "Error response",
  required: ["message"],
  properties: {
    name: { type: "string" },
    message: { type: "string" },
  },
} as const;

export default errorSchema;
