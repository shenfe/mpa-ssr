const fs = require('fs');
const path = require('path');

module.exports = function (content) {
    if (fs.existsSync(this.resourcePath.replace(/\.js$/, '.css'))) return `require('./index.css');${content}`;
    if (fs.existsSync(this.resourcePath.replace(/\.js$/, '.scss'))) return `require('./index.scss');${content}`;
    if (fs.existsSync(this.resourcePath.replace(/\.js$/, '.sass'))) return `require('./index.sass');${content}`;
    return content;
};
