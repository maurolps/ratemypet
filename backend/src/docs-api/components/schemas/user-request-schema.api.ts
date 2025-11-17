const userRequestSchema = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    name: { type: "string", minLength: 3, example: "any_name" },
    email: {
      type: "string",
      format: "email",
      example: "valid_email@mail.com",
    },
    password: {
      type: "string",
      minLength: 6,
      example: "valid_password",
    },
  },
} as const;

export default userRequestSchema;
