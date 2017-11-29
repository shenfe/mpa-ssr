const fs = require('fs');
const path = require('path');

const ip = require('ip');
const ipAddr = ip.address();
const port = 3000;

const appDomain = '';
const cdnDomain = '';

const projConf = require('./config');
const appResourcePath = projConf.resourceVisitPath; // 【重要】静态资源访问地址
const entryRoute = projConf.entryRoute;
const pageEntryRecordFile = path.join(process.cwd(), 'build', projConf.pageEntryRecord);

const { readData } = require('./helper');

module.exports = {
    port: port,
    host: '0.0.0.0',
    inline: true,
    compress: true,

    /**
     * [devserver-historyapifallback](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback)
     */
    historyApiFallback: {
        rewrites: [
            // 【示例】路由
            { from: /^\/$/, to: '/resource/list.html' },
            { from: /\/\d+/, to: '/resource/detail.html' }
        ]
    },

    hot: true,
    https: false,
    overlay: {
        warnings: true,
        errors: true
    },
    clientLogLevel: 'error',
    before(app) {
        app.get(`/${entryRoute}`, function (req, res) {
            const pages = JSON.parse(fs.readFileSync(pageEntryRecordFile, 'utf8'));
            res.send('<ul>' + pages.map(p => `<li><a href="${appResourcePath}${p}.html" target="_blank">${p}</a></li>`).join('') + '</ul>');
        });

        // 【示例】mock接口
        app.get('/api/getDetail', function (req, res) {
            res.json(readData(path.resolve(__dirname, '../mock/api-get-detail.json')));
        });
        app.get('/api/getList', function (req, res) {
            res.json(readData(path.resolve(__dirname, '../mock/api-get-list.json')));
        });
    },

    /**
     * [devserver-proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy)
     */
    proxy: {
        // 【示例】代理接口
        '/api/**': {
            target: 'https://other-server.example.com',
            secure: false,
            changeOrigin: true
        }
    },

    publicPath: appResourcePath,
    contentBase: [
        path.resolve(__dirname, '../dist')
    ]
};
