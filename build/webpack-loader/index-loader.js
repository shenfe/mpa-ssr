const fs = require('fs');
const path = require('path');

module.exports = function (content) {
    if (fs.existsSync(this.resourcePath.replace(/\.js$/, '.css'))) {
        this.addDependency('./index.css');
        content = `require('./index.css');${content}`;
    } else if (fs.existsSync(this.resourcePath.replace(/\.js$/, '.scss'))) {
        this.addDependency('./index.scss');
        content = `require('./index.scss');${content}`;
    } else if (fs.existsSync(this.resourcePath.replace(/\.js$/, '.sass'))) {
        this.addDependency('./index.sass');
        content = `require('./index.sass');${content}`;
    }

    console.log(`${this.resourcePath} has been injected with css.`);

    return content;
};
