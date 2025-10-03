import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { makeApp } from "./http/app";

const bootstrap = async () => {
  const PORT = process.env.PORT || 8000;
  const DATABASE_URL = process.env.DATABASE_URL || "";

  const db = PgPool.getInstance();
  db.connect(DATABASE_URL);
  const dbReady = await db.health();

  if (dbReady) {
    const app = makeApp();
    app.listen(PORT, () => {
      console.log("Server listening on port: ", PORT);
    });
  }
};

bootstrap().catch((error) => {
  console.error("Fatal bootstrap error: ", error);
});
