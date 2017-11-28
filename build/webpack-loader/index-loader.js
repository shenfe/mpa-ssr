const fs = require('fs');
const path = require('path');

const loaderUtils = require('loader-utils');

module.exports = function (content) {
    let query = loaderUtils.getOptions(this) || {};
    console.log(query);
    let injectTemplateRender = '';
    if (String(query.local) === 'true') {
        injectTemplateRender = `(function () {
            let placeholder = document.getElementById('placeholder-${path.basename(path.dirname(this.resourcePath))}');
            let data = JSON.parse(document.getElementById('here-is-ssr-data').value);
            placeholder.parentNode.innerHTML = window.VTE.render(require('index.html'), data);
        })();`;
    }
    this.addDependency('./index.html');

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

    return injectTemplateRender + content;
};
