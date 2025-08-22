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
    },
  },
});
