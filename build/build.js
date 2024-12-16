require('shelljs/global')

process.env.NODE_ENV = 'production'

var ora = require('ora')
var fs = require('fs')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('./config')
var webpackConfig = require('./webpack.prod.conf')
var execFile = require('child_process').execFile

function deleteFile(path) {
    if (fs.statSync(path).isDirectory()) {
        fs.readdir(path, (err, files) => {
            if (!files) return;
            files.forEach((file) => {
                let current_path = path + '/' + file
                let now = new Date().getTime();
                let file_time = fs.statSync(current_path).mtimeMs
                if (now - file_time > 30 * 24 * 60 * 60 * 1000) {
                    fs.unlinkSync(current_path);
                }
            })
        })
    } else {
        let now = new Date().getTime();
        let file_time = fs.statSync(path).mtimeMs
        if (now - file_time > 30 * 24 * 60 * 60 * 1000) {
            fs.unlinkSync(path);
        }
    }
};
// 删除一个月之前的文件
if (fs.existsSync(path.join(process.cwd(), 'dist/peanut_h5'))) {
    let dist_path = path.join(process.cwd() + '/dist/peanut_h5')
    fs.readdir(dist_path + '/js', (err, files) => {
        if (!files) return;
        files.forEach((file) => {
            let current_path = dist_path + '/js/' + file
            deleteFile(current_path);
        })
    })
    fs.readdir(dist_path + '/css', (err, files) => {
        if (!files) return;
        files.forEach((file) => {
            let current_path = dist_path + '/css/' + file
            deleteFile(current_path);
        })
    })
}
var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.prod.assetsRoot, config.prod.assetsSubDirectory)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function (err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ));

    spinner.stop()
})