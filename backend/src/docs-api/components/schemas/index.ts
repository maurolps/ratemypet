import userResponse from "./user-response-schema.api";
import userRequest from "./user-request-schema.api";
import errorSchema from "./error-schema.api";

const schemas = {
  userResponse,
  userRequest,
  errorSchema,
} as const;

export default schemas;
