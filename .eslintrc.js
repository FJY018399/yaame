/*
 * @Author: Elk
 * @Date: 2023-07-26 18:10:08
 * @FilePath: /yaame-h5/.eslintrc.js
 * @Description: eslint 配置文件
 */

module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es6: true,
    },
    extends: ['plugin:vue/essential', 'eslint:recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        parser: '@babel/eslint-parser',
        sourceType: 'module',
        ecmaVersion: 2020,
        requireConfigFile: false,
    },
    rules: {
        // Vue 规则
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4],
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/match-component-file-name': [
            'error',
            {
                extensions: ['vue'],
                shouldMatchCase: false,
            },
        ],
        'vue/component-name-in-template-casing': [
            'error',
            'PascalCase',
            {
                registeredComponentsOnly: false,
            },
        ],

        // JavaScript 规则
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': [
            'warn',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true,
            },
        ],
        'no-undef': 'error',
        'no-var': 'error',
        'prefer-const': [
            'error',
            {
                destructuring: 'any',
                ignoreReadBeforeAssign: false,
            },
        ],

        // 代码风格规则（这些会被 Prettier 接管）
        indent: 'off',
        quotes: 'off',
        semi: 'off',
        'comma-dangle': 'off',

        // Prettier 集成规则
        'prettier/prettier': [
            'error',
            {
                printWidth: 100,
                tabWidth: 4,
                useTabs: false,
                semi: true,
                singleQuote: true,
                quoteProps: 'as-needed',
                jsxSingleQuote: false,
                trailingComma: 'all',
                bracketSpacing: true,
                bracketSameLine: false,
                arrowParens: 'always',
                endOfLine: 'auto',
                vueIndentScriptAndStyle: false,
            },
        ],
    },
    // 针对特定文件的规则覆盖
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off',
            },
        },
    ],
};
