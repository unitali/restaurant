module.exports = {
  root: true,
  env: { node: true, es2020: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  ignorePatterns: ["lib/**"],
  rules: {
    // suas regras personalizadas aqui (opcional)
  }
};