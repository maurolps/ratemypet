import path from "node:path";
import { execa } from "execa";

export const dbmateMigrate = async (uri: string) => {
  const uriSslDisabled = `${uri}?sslmode=disable`;

  const migrationsDir = path.resolve(
    process.cwd(),
    "backend/src/main/modules/infra/db/migrations",
  );

  const env = {
    ...process.env,
    PGSSLMODE: "disable",
    DATABASE_URL: uriSslDisabled,
  };

  await execa(
    "dbmate",
    ["-d", migrationsDir, "--wait", "--no-dump-schema", "up"],
    {
      preferLocal: true,
      env,
    },
  );
};
