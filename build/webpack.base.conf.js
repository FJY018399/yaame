var path = require('path')
var utils = require('./utils')
var config = require('./config')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
var entries = utils.getEntry('./src/pages/**/*.js')

module.exports = {
    entry: entries,
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    output: {
        filename: process.env.NODE_ENV === 'production' ? "js/[name].[contenthash].js" : "js/[name].js",
        path: process.env.NODE_ENV === 'production' ? config.prod.assetsRoot : config.dev.assetsPublicPath,
        publicPath: process.env.NODE_ENV === 'production' ? config.prod.assetsPublicPath : config.dev.assetsPublicPath
    },
    module: {
        rules: [{
            test: /\.vue$/,
            exclude: /node_modules/,
            use: [
                { loader: 'vue-loader' }
            ]
        }, {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ]
        }, {
            test: /\.less$/,
            use: ['style-loader','css-loader','less-loader',]
        }, 
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [/(node_modules)(?![/|\\](swiper))/],
            include: [resolve('src'), resolve('test')]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 2048,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.mp3$/,
            loader: 'url-loader',
            options: {
                limit: 0,
                name: utils.assetsPath('audio/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 2048,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: "css/[id].[contenthash].css"
        }),
    ]
}