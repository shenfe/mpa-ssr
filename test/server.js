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

const vte = require('velocity-template-engine');

const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const express = require('express');
const app = express();

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

const port = 3000;

server.listen(port, function () {
    console.log('Listening on port %d', port);
});

app.use(express.static(path.resolve(cwd, 'dist')));

const pages = fs.readdirSync(path.resolve(cwd, 'dist/page')).map(p => p.replace(/\.[a-z]+$/, ''));

console.log(pages);

app.get(`/`, function (req, res) {
    res.send('<ul>' + pages.map(p => `<li><a href="/${p}" target="_blank">${p}</a></li>`).join('') + '</ul>');
});

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

open(`http://127.0.0.1:${port}`);