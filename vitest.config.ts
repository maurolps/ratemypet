import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  test: {
    environment: "node",
    include: ["./backend/tests/**/*.spec.ts"],
    coverage: {
      reporter: ["text-summary"],
      reportsDirectory: "./backend/coverage",
    },
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
