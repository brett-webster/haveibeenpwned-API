// https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  settings: {
    react: {
      version: "detect", // Automatically detect the react version
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.node.json"],
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // Override ESLint configuration expecting functions passed as arguments (e.g. route handlers) to not return a Promise (this is needed to avoid linting error in sampleQueryEndpoints.ts)
    // Alternative approaches:  wrap each CRUD API endpoint in an IIFE when using async/await OR simply use .then() Promise chaining instead of async/await
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
  },
};
