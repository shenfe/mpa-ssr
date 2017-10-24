const args = process.argv.slice(2);
const inputPages = [];
const options = {
    uglify: true,
    local: false,
    bundleAnalyse: false, // 是否使用BundleAnalyzerPlugin
    buildTogether: true // 是所有页面作为multi-entry一次性用webpack构建，还是每个页面分开、多次构建
};

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

const webpackConfigBuilder = require('./webpack.config.builder.js');

const pages = inputPages.length ? inputPages : Object.keys(require('./helper.js').getPagesEntry());

console.log(pages);

if (options.buildTogether) {
    webpackConfigBuilder(pages, options);
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
