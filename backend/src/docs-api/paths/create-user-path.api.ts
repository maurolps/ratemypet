const createUserPath = {
  "/api/users": {
    post: {
      tags: ["Users"],
      summary: "Create User",
      description: "Creates a user and returns the created record.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/userRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/userResponse" },
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
                    message: "Missing Param: password",
                  },
                },
              },
            },
          },
        },
        409: { description: "Email already in use" },
        500: { description: "Internal server error" },
      },
    },
  },
} as const;

export default createUserPath;
