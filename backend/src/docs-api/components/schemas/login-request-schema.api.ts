const loginRequestSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
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

export default loginRequestSchema;
