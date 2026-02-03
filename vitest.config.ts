import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  test: {
    environment: "node",
    coverage: {
      reporter: ["text-summary", "lcov"],
      reportsDirectory: "./backend/coverage",
      include: ["backend/src/main/layers/**/*.ts"],
      exclude: [
        "backend/src/main/layers/infra/db/postgres/adapters/pg-unit-of-work.adapter.ts",
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["./backend/tests/**/*.spec.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["./backend/tests/**/*.test.ts"],
          globalSetup: "./backend/tests/config/global-setup.ts",
          setupFiles: "./backend/tests/config/setup-db.ts",
          testTimeout: 60_000,
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@domain": "/backend/src/main/layers/domain",
      "@presentation": "/backend/src/main/layers/presentation",
      "@application": "/backend//src/main/layers/application",
      "@infra": "/backend/src/main/layers/infra",
      "@shared": "/backend/src/main/shared",
      "@tests": "/backend/src/tests",
      "@main": "/backend/src/main",
    },
  },
});
