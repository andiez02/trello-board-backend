module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ["airbnb-base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": ["error", { usePrettierrc: true }],
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "no-param-reassign": "off",
    "no-shadow": "off",
    "class-methods-use-this": "off",
    "no-unused-vars": "off",
    "import/prefer-default-export": "off",
    "import/no-import-module-exports": "off",
    "default-param-last": "off",
    radix: "off",
    "consistent-return": "off",
    "no-restricted-syntax": "off",
    "dot-notation": "off",
    "no-unused-expressions": "off",
    "no-useless-constructor": "off",
    "no-empty-function": "off",
    "no-await-in-loop": "off",
    "no-undef": "off",
    "no-nested-ternary": "off",
    "no-use-before-define": "off",
  },
};
