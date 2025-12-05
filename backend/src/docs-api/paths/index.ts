import createUserPath from "./create-user-path.api";
import loginPath from "./login-path.api";
import refreshTokenPath from "./refresh-token-path.api";

const paths = {
  ...createUserPath,
  ...loginPath,
  ...refreshTokenPath,
} as const;

export default paths;
