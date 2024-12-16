var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var WebpackBundleAnalyzer = require('webpack-bundle-analyzer');
const WorkBoxPlugin = require('workbox-webpack-plugin');
const SwRegisterWebpackPlugin = require('sw-register-webpack-plugin');
var entries = utils.getEntry('./src/pages/**/*.js')

const {
    BundleAnalyzerPlugin,
} = WebpackBundleAnalyzer;

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

var webpackConfig = merge(baseWebpackConfig, {
    mode: config.prod.env,
    devtool: config.prod.sourceMap ? '#source-map' : false,
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 1,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.prod.env
        }),

        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true,
                autoprefixer: false
            }
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './../static'),
            to: path.resolve(__dirname, './../dist/yaame_h5'),
            ignore: ['.*']
        }]),
    ]
})

for (var pathname in entries) {
    var filename = 'yaame_h5/' + pathname.split('/')[pathname.split('/').length - 1];
    var conf = {
        filename: path.resolve(__dirname, '../dist/' + filename + '.html'),
        template: 'template/index.html',
        inject: true,
        chunksSortMode: 'dependency',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyJS: true,
            minifyCSS: true
        }
    };
    if (pathname in webpackConfig.entry) {
        conf.chunks = ['vendor', pathname];
        conf.hash = false;
    }

    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

if (config.prod.analyzer) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

if (config.prod.pwa) {
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

module.exports = webpackConfig