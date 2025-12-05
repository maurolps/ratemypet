const refreshTokenResponseSchema = {
  type: "object",
  properties: {
    accessToken: {
      type: "string",
      description: "The new access token issued after refreshing.",
      example: "jwt_access_token",
    },
  },
  description:
    "Response schema for token refresh operation. Includes a new accessToken (body) and refreshToken (cookie).",
} as const;

export default refreshTokenResponseSchema;
