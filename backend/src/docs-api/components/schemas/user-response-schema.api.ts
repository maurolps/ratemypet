const userResponseSchema = {
  type: "object",
  required: ["id", "name", "email", "createdAt"],
  properties: {
    id: { type: "string", example: "uuid" },
    name: { type: "string", example: "any_name" },
    email: { type: "string", format: "email", example: "valid_email@mail.com" },
    createdAt: { type: "string", format: "date-time" },
  },
} as const;

export default userResponseSchema;
