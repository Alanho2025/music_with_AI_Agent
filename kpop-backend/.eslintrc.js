module.exports = {
    env: {
        node: true,
        es2023: true,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": "error",
        "no-unused-vars": "warn"
    },
};
  