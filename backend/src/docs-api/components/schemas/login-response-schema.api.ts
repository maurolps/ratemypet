const loginResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string", example: "any_id" },
    name: { type: "string", example: "any_name" },
    email: { type: "string", format: "email", example: "valid_email@mail.com" },
    createdAt: { type: "string", format: "date-time" },
    token: {
      type: "object",
      properties: {
        accessToken: {
          type: "string",
          example: "jwt_access_token",
        },
      },
    },
  },
} as const;

export default loginResponseSchema;
