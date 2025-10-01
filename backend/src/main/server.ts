import { makeApp } from "./http/app";

const bootstrap = () => {
  const PORT = process.env.PORT || 8000;
  const app = makeApp();
  app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
  });
};

bootstrap();
