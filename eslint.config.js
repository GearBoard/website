import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  // Global ignores (backend + frontend)
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/generated/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/next-env.d.ts",
    ],
  },

  // Backend: TypeScript + Prettier
  { files: ["backend/**/*.{ts,tsx,js,jsx}"], ...js.configs.recommended },
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files: ["backend/**/*.{ts,tsx,js,jsx}"],
  })),
  { files: ["backend/**/*.{ts,tsx,js,jsx}"], ...prettier },
  {
    files: ["backend/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "writable",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prefer-const": "error",
      eqeqeq: "error",
    },
  },

  // Frontend: Next.js
  ...nextVitals.map((c) => ({ ...c, files: ["frontend/**/*.{ts,tsx,js,jsx}"] })),
  ...nextTs.map((c) => ({ ...c, files: ["frontend/**/*.{ts,tsx,js,jsx}"] })),
  {
    files: ["frontend/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": ["error", "frontend/src/app/"],
    },
  },
]);
