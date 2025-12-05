const refreshTokenPath = {
  "/api/users/refresh-token": {
    post: {
      tags: ["Users"],
      summary: "Refresh Access Token",
      parameters: [
        {
          name: "refreshToken",
          in: "cookie",
          required: true,
          description:
            "Note: This is just for documentation purposes. The refresh token is expected to be already present in the HTTP-only cookie after Login, and handled by the browser.",
          schema: {
            type: "string",
            example: "refreshToken={id}.{secret}",
          },
        },
      ],
      description: "Issue a new access token and rotate the refresh token.",
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: "OK",
          headers: {
            "Set-Cookie": {
              schema: {
                type: "string",
                example: "refreshToken={id}.{secret}; HttpOnly; Path=/; Secure",
              },
              description:
                "Set-Cookie header containing the new refresh token.",
            },
          },
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/refreshTokenResponse" },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/errorSchema" },
              examples: {
                missingParam: {
                  summary: "Missing Param",
                  value: {
                    name: "MissingParamError",
                    message: "Missing Param: refreshToken",
                  },
                },
              },
            },
          },
        },
        401: {
          description:
            "Unauthorized - Invalid, expired or malformed refresh token",
        },
        429: {
          name: "RateLimitExceeded",
          description: "Limit exceeded. Please try again later.",
        },
        500: { description: "Internal server error" },
      },
    },
  },
} as const;

export default refreshTokenPath;
