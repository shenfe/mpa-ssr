const path = require('path');

const ip = require('ip');
const ipAddr = ip.address();
const port = 3000;

const appDomain = '';
const cdnDomain = '';
const appResourcePath = '/resource/'; // 重要，静态资源访问地址

module.exports = {
    port: port,
    host: '0.0.0.0',
    inline: true,
    compress: true, // Gzipped or not
    historyApiFallback: {
        // See [devserver-historyapifallback](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback)
        rewrites: [
        ]
    },
    hot: true,
    https: false,
    open: true,
    overlay: {
        warnings: true,
        errors: true
    },
    clientLogLevel: 'error',
    proxy: {
        // See [devserver-proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy)
        '/api/**': {
            target: 'https://other-server.example.com',
            secure: false,
            changeOrigin: true
        }
    },
    publicPath: `${appResourcePath}`,
    contentBase: [
        path.resolve(__dirname, '../dist')
    ]
};
