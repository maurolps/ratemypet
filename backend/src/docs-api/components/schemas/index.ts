import userResponse from "./user-response-schema.api";
import userRequest from "./user-request-schema.api";
import errorSchema from "./error-schema.api";
import loginResponse from "./login-response-schema.api";
import loginRequest from "./login-request-schema.api";

const schemas = {
  userResponse,
  userRequest,
  loginResponse,
  loginRequest,
  errorSchema,
} as const;

export default schemas;
