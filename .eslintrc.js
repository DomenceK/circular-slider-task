module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended", "plugin:import/recommended"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
}
