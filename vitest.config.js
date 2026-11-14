import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.js"],
      reporter: ["text", "text-summary", "html"],
      // Si la cobertura baja de estos mínimos, npm run coverage falla (también en CI).
      thresholds: { lines: 90, branches: 90, functions: 90, statements: 90 },
    },
  },
});
