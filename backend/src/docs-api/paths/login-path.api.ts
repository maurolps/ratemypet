const loginPath = {
  "/api/users/login": {
    post: {
      tags: ["Users"],
      summary: "Login User",
      description: "Authenticates a user and returns a JWT token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/loginRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "OK",
          headers: {
            "Set-Cookie": {
              schema: {
                type: "string",
                example: "refreshToken={id}.{secret}; HttpOnly; Path=/; Secure",
              },
              description: "Set-Cookie header containing a refresh token.",
            },
          },
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/loginResponse" },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/errorSchema",
              },
              examples: {
                missingParam: {
                  summary: "Missing Param",
                  value: {
                    name: "MissingParamError",
                    message: "Missing Param: email",
                  },
                },
                invalidParam: {
                  summary: "Invalid Param",
                  value: {
                    name: "InvalidParamError",
                    message: "Invalid Param: email",
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized - Invalid credentials" },
        500: { description: "Internal server error" },
      },
    },
  },
} as const;

export default loginPath;
