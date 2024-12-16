/*
 * @Author: Elk
 * @Date: 2024-11-25 12:01:38
 * @FilePath: /yaame-h5/babel.config.js
 * @Description:
 */
module.exports = {
    presets: [
        ['@vue/cli-plugin-babel/preset', {
            useBuiltIns: 'usage',
            corejs: 3,
            targets: {
                chrome: '58',
                ie: '11'
            }
        }]
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-transform-typeof-symbol',
        ['import', {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
        }]
    ]
};