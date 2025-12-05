import schemas from "./schemas";
import securitySchemes from "./security.api";

const components = {
  schemas,
  securitySchemes,
} as const;

export default components;
