const securitySchemes = {
  cookieAuth: {
    type: "apiKey",
    in: "cookie",
    name: "refreshToken",
    description:
      "HTTP-only cookie containing the refresh token in the format {id}.{secret}. Used for refreshing access tokens.",
  },
} as const;

export default securitySchemes;
