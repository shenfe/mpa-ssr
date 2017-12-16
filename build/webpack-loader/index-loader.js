const fs = require('fs');
const path = require('path');

const loaderUtils = require('loader-utils');

module.exports = function (content) {
    let query = (loaderUtils.getOptions ? loaderUtils.getOptions(this) : loaderUtils.parseQuery(this.query)) || {};
    console.log(query);

    let injectTemplateRender = '';
    if (String(query.local) === 'true' && query.type === 'module' && fs.existsSync(this.resourcePath.replace(/\.js$/, '.html'))) {
        injectTemplateRender = `(function () {
            let placeholder = window.document.getElementById('placeholder-${path.basename(path.dirname(this.resourcePath))}');
            if (!placeholder) return;
            let data = JSON.parse(window.document.getElementById('here-is-ssr-data').value);
            placeholder.parentNode.innerHTML = require('velocity-template-engine').render(require('./index.html'), data);
        })();
        if (module.hot) {
            module.hot.accept('./index.html', function () {
                location.reload();
            });
        }
        `;
    }
    if (fs.existsSync(this.resourcePath.replace(/\.js$/, '.html'))) {
        this.addDependency('./index.html');
        content = injectTemplateRender + content + `;require('./index.html');`;
    }

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

    console.log(`${this.resourcePath} has been injected.`);

    return content;
};
