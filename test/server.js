const args = process.argv.slice(2);
const options = {
    https: false
};

args.forEach(function (val, index, array) {
    console.log(`${index}: ${val}`);
    switch (val) {
    case '--https':
        options.https = true;
        break;
    }
});

const projConf = require('../build/config');
const devServerConfig = require('../build/server.config');

const vte = require('velocity-template-engine');

const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const express = require('express');
const app = express();

const proxy = require('http-proxy-middleware');

const helper = require('../build/helper');
const open = require('open');

const http = require('http');

const https = require('https');
const credentials = {
    key: fs.readFileSync(path.resolve(__dirname, 'sslcert/private.pem'), 'utf8'),
    cert: fs.readFileSync(path.resolve(__dirname, 'sslcert/file.crt'), 'utf8')
};

const server = options.https ?
    https.createServer(credentials, app) :
    http.createServer(app);

const port = projConf.devel.port;

app.use(express.static(path.resolve(cwd, 'dist')));

(devServerConfig.before || devServerConfig.setup)(app);

for (let api in devServerConfig.proxy) {
    if (!devServerConfig.proxy.hasOwnProperty(api)) continue;
    app.use(api, proxy(devServerConfig.proxy[api]));
}

const rewriter = require('../build/util/http-rewrite-middleware');
const router = require('../build/server.router');

app.use(rewriter({
    rewrites: router(),
    verbose: true
}));

const pages = fs.readdirSync(path.resolve(cwd, 'dist/page')).map(p => p.replace(/\.[a-z]+$/, ''));

console.log(pages);

pages.forEach(p => {
    app.get(`/${p}`, function (req, res) {
        res.send(
            vte.render(
                helper.readFile(path.resolve(cwd, `dist/page/${p}.html`)),
                helper.readData(path.resolve(cwd, `mock/page-${p}.json`))
            )
        );
    })
});

server.listen(port, function () {
    console.log('Listening on port %d', port);
});

open(`http://127.0.0.1:${port}`);
