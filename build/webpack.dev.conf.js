var utils = require('./utils')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const WorkBoxPlugin = require('workbox-webpack-plugin');
const SwRegisterWebpackPlugin = require('sw-register-webpack-plugin');
var path = require('path')
var entries = utils.getEntry('./src/pages/**/*.js')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
    mode: config.dev.env,
    // eval-source-map is faster for development
    // devtool: '#cheap-module-eval-source-map',
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ]
})
for (var pathname in entries) {
    var filename = pathname.split('/')[pathname.split('/').length - 1];
    var conf = {
        filename: filename + '.html',
        template: 'template/index.html',
        inject: true
    };
    if (pathname in webpackConfig.entry) {
        conf.chunks = ['vendor', pathname];
        conf.hash = false;
    }

    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

if (config.dev.pwa) {
    webpackConfig.plugins.push(new WorkBoxPlugin.InjectManifest({
        swSrc: path.resolve(__dirname, './../src/service-worker.js'),
        // importWorkboxFrom: 'local',
        exclude: [/\.html$/],
        include: [/\.css$/, /\.js$/, /\.(png|jpg|jpeg|gif)$/],
    }));
    webpackConfig.plugins.push(new SwRegisterWebpackPlugin({
        version: +new Date()
    }));

}

module.exports = webpackConfig;