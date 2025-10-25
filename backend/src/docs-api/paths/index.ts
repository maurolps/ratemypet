import usersCreate from "./create-user-path.api";

const paths = {
  ...usersCreate,
} as const;

export default paths;
