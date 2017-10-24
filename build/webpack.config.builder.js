const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfigCreator = require('./webpack.config.creator');

const webpackDevServerConfig = require('./server.config');

module.exports = (viewPaths, options = {}, callback) => {
    console.log('building ' + (viewPaths || ['all']).join(', '));

    options.done = callback;

    let conf = webpackConfigCreator(viewPaths, options);

    let compiler = Webpack(conf);

    if (options.local) {
        let server = new WebpackDevServer(compiler, webpackDevServerConfig);
        server.listen(webpackDevServerConfig.port, webpackDevServerConfig.host, () => {
            // ...
        });
    } else {
        compiler.run((err, stats) => {
            // ...
        });
    }
};
