// vue.config.js


// const config = require("./build/config");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// 读取目录名称，排除非JS文件
const pagesDir = path.join(__dirname, "src", "pages");
let pagesName = fs.readdirSync(pagesDir).filter((file) => {
    const fullPath = path.join(pagesDir, file);
    return fs.statSync(fullPath).isDirectory();
});

// 文件太多导致热更新缓慢，支持命令指定打包文件名
if (process.env.npm_config_page) {
    let devPages = process.env.npm_config_page.split(",");
    let successNames = [];
    let errorNames = [];

    devPages.forEach((p) => {
        let hasPage = pagesName.indexOf(p) !== -1;
        if (hasPage) {
            successNames.push(p);
        } else {
            errorNames.push(p);
        }
    });
    console.log("已打包页面", successNames);
    if (errorNames.length) {
        console.error("未找到页面", errorNames);
    }

    pagesName = successNames;
}

const pages = {};
pagesName.forEach((page) => {
    pages[page] = {
        entry: `src/pages/${page}/${page}.js`,
        template: "template/index.html",
        filename: `${page}.html`,
        chunks: ["chunk-vendors", "chunk-common", `chunk-${page}-vendors`, `${page}`],
    };
});

module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,
    outputDir: "dist/yaame_h5",
    publicPath: "/",
    pages: {
        // index: {
        //   entry: "src/main.js",
        //   template: "template/index.html",
        //   filename: `index.html`,
        //   chunks: ["chunk-vendors", "chunk-common", `chunk-index-vendors`, `index`],
        // },
        ...pages,
    },
    lintOnSave: true,
    configureWebpack: (config) => {
        // devtool: 'source-map'
        return {
            plugins: [
                new CompressionPlugin({
                    algorithm: "gzip", //开启gzip
                    test: /\.js$|\.html$|.\css/, // 匹配文件名
                    threshold: 10240, // 对超过10k的数据压缩
                    deleteOriginalAssets: false, // 不删除源文件
                }),
                new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), //忽略/moment/locale下的所有文件
                // new BundleAnalyzerPlugin(),
                new CopyWebpackPlugin([
                    {
                        from: path.resolve(__dirname, "./node_modules/libpag/lib/libpag.wasm"),
                        to: "./js",
                    },
                ]),
            ],
        };
    },
    chainWebpack: (config) => {
        //相对路径下 内联文件大小限制 10240 10K
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap((options) => Object.assign(options, { limit: 2048 }));

        // 多入口打包优化 修复例如 a 页面引入了 axios，b 页面打包后即使没有使用 axios，也会引入 axios 的问题，详情见下面 github 链接
        // https://github.com/vuejs/vue-cli/issues/2381
        // https://gist.github.com/Akryum/ece2ca512a1f40d70a1d467566783219

        const options = module.exports;
        const pages = options.pages;
        const pageKeys = Object.keys(pages);
        const IS_VENDOR = /[\\/]node_modules[\\/]/;

        config.optimization.splitChunks({
            cacheGroups: {
                vendors: {
                    name: "chunk-vendors",
                    priority: -10,
                    chunks: "initial",
                    minChunks: 10,
                    test: IS_VENDOR,
                    enforce: true,
                },
                ...pageKeys.map((key) => ({
                    name: `chunk-${key}-vendors`,
                    priority: -11,
                    chunks: (chunk) => chunk.name === key,
                    test: IS_VENDOR,
                    enforce: true,
                })),
                common: {
                    name: "chunk-common",
                    priority: -20,
                    chunks: "initial",
                    minChunks: 5,
                    reuseExistingChunk: true,
                    enforce: true,
                },
            },
        });
    },
};
