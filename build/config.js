/*
 * @Author: Elk
 * @Date: 2022-07-19 15:45:49
 * @FilePath: /yaame-h5/build/config.js
 * @Description: 
 */
let path = require('path');

module.exports = {
    prod: {
        env: 'production',
        assetsRoot: path.resolve(__dirname, '../dist/yaame_h5/'),
        assetsSubDirectory: '',
        assetsPublicPath: './',
        sourceMap: false,
        analyzer: false,
        pwa: false,
    },
    dev: {
        env: 'development',
        port: 8017,
        assetsSubDirectory: '',
        assetsPublicPath: '/',
        proxyTable: {
            '/yaame': {
                target: 'http://yaame.yaame.net',
                changeOrigin: true,
                pathRewrite: {
                    '^/peanut': 'peanut'
                }
            }
        },
        pwa: false
    }
};