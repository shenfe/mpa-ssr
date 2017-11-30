const args = process.argv.slice(2);
const inputPages = [];
const options = {
    uglify: true,
    local: false,
    bundleAnalyse: false, // 是否使用BundleAnalyzerPlugin
    buildTogether: true // 是所有页面作为multi-entry一次性用webpack构建，还是每个页面分开、多次构建
};

const fs = require('fs');
const path = require('path');
require('shelljs/global');

args.forEach(function (val, index, array) {
    console.log(`${index}: ${val}`);
    switch (val) {
    case '--no-uglify':
        options.uglify = false;
        break;
    case '--local':
        options.local = true;
        break;
    case '--ba':
        options.bundleAnalyse = true;
        break;
    default:
        inputPages.push(val);
    }
});

const projConf = require('./config');

const webpackConfigBuilder = require('./webpack.config.builder.js');

const devServerPort = projConf.devel.port;

const pages = inputPages.length ? inputPages : Object.keys(require('./helper.js').getPagesEntry());

const open = require('open');

console.log(pages);

const cwd = process.cwd();

// 将被构建的页面记录在临时的json文件中，以供devserver在启动时读取
fs.writeFileSync(path.join(cwd, 'build', projConf.pageEntryRecord), JSON.stringify(pages), 'utf8');

let openOnce = false;

if (options.buildTogether) {
    webpackConfigBuilder(pages, options, () => {
        fs.existsSync(path.resolve(cwd, 'dist/resource/service-worker.js')) && cp(path.resolve(cwd, 'dist/resource/service-worker.js'), path.resolve(cwd, 'dist/service-worker.js'));
        if (!openOnce) {
            options.local && open(`http://127.0.0.1:${devServerPort}`);
            openOnce = true;
        }
    });
} else {
    const build = i =>
        webpackConfigBuilder([pages[i]], options, () => {
            let p = pages[i];
            console.log(`Page ${p} done.`);
            i++;
            if (i < pages.length) {
                build(i);
            }
        });

    build(0);
}
