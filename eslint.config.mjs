import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
]);
