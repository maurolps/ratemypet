import usersCreate from "./create-user-path.api";
import loginPath from "./login-path.api";

const paths = {
  ...usersCreate,
  ...loginPath,
} as const;

export default paths;
