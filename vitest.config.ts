import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  test: {
    environment: "node",
    coverage: {
      reporter: ["text-summary"],
      reportsDirectory: "./backend/coverage",
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
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@domain": "/backend/src/main/modules/domain",
      "@presentation": "/backend/src/main/modules/presentation",
      "@application": "/backend//src/main/modules/application",
      "@infra": "/backend/src/main/modules/infra",
      "@shared": "/backend/src/main/shared",
      "@tests": "/backend/src/tests",
      "@main": "/backend/src/main",
    },
  },
});
