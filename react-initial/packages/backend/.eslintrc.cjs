module.exports = {
  root: true,
  env: { es2020: true, node: true },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  ignorePatterns: ["node_modules", "dist"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["prettier"],
};
