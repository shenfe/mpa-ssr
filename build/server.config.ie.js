const fs = require('fs');
const path = require('path');

const ip = require('ip');
const ipAddr = ip.address();

const appDomain = '';
const cdnDomain = '';

const projConf = require('./config');
const port = projConf.devel.port;
const appResourcePath = projConf.resourceVisitPath; // 【重要】静态资源访问地址

const cwd = process.cwd();
const pageEntryRecordFile = path.join(cwd, 'build', projConf.pageEntryRecord);

const { readData } = require('./helper');

const allPages = fs.readdirSync(path.resolve(cwd, 'src/page'))
    .filter(file => fs.lstatSync(path.resolve(cwd, 'src/page/' + file)).isDirectory());

const router = require('./server.router');

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
            ...(allPages.map(p => ({
                from: new RegExp(`^\\/${p}$`),
                to: `${appResourcePath}${p}.html`
            }))),
            ...(router(appResourcePath))
        ]
    },

    hot: true,
    https: false,
    overlay: {
        warnings: true,
        errors: true
    },
    clientLogLevel: 'error',
    setup(app) {
        app.get(`/`, function (req, res) {
            const pages = JSON.parse(fs.readFileSync(pageEntryRecordFile, 'utf8'));
            res.send('<ul>' + pages.map(p => `<li><a href="/${p}" target="_blank">${p}</a></li>`).join('') + '</ul>');
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
            target: 'https://api.github.com/users/octocat/orgs',
            pathRewrite: { '.*': '' },
            secure: false,
            changeOrigin: true
        }
    },

    publicPath: appResourcePath,
    contentBase: [
        path.resolve(__dirname, '../dist')
    ]
};
