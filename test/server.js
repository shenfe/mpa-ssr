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

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const http = require('http');

const https = require('https');
const credentials = {
    key: fs.readFileSync(path.resolve(__dirname, 'sslcert/private.pem'), 'utf8'),
    cert: fs.readFileSync(path.resolve(__dirname, 'sslcert/file.crt'), 'utf8')
};

const server = options.https ?
    https.createServer(credentials, app) :
    http.createServer(app);

server.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});

app.use(express.static(path.resolve(process.cwd(), 'dist')));
