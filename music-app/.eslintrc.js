module.exports = {
    env: {
        browser: true,
        es2023: true,
    },
    extends: ['react-app', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error'],
        'no-unused-vars': 'warn',
        'react/prop-types': 'off',
    },
};
