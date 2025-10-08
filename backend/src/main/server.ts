import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { makeApp } from "./http/app";

const db = PgPool.getInstance();

const bootstrap = async () => {
  const PORT = process.env.PORT || 8000;
  const DATABASE_URL = process.env.DATABASE_URL || "";

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
  console.log("Fatal bootstrap error: ", error.message);
});

process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception: ", err.message);
  db.disconnect();
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection: ", promise);
  console.error("Reason: ", reason);
});
