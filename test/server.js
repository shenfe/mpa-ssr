const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const https = require('https');
const privateKey = fs.readFileSync(path.resolve(__dirname, 'sslcert/private.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'sslcert/file.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000, function () {
    console.log('Listening on port %d', httpsServer.address().port);
});

app.use(express.static(path.resolve(process.cwd(), 'dist')));
