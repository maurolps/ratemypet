import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  test: {
    globals: true,
    environment: "node",
    include: ["./backend/src/**/*.spec.ts"],
    coverage: {
      reporter: ["text-summary"],
      reportsDirectory: "./backend/coverage",
    },
  },
});
