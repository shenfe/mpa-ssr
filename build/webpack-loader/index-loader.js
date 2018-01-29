const fs = require('fs');
const path = require('path');

const loaderUtils = require('loader-utils');

const someTypeModuleOfFile = (p, types = []) => {
    let fileName = path.basename(p).replace(/\.[a-z]+$/, '');
    for (let fileType of types) {
        if (fs.existsSync(p.replace(/\.[a-z]+$/, '.' + fileType))) {
            return {
                name: `${fileName}.${fileType}`,
                path: p.replace(/\.[a-z]+$/, '.' + fileType)
            };
        }
    }
};

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
            module.hot.accept(['./index.html'], function () {
                console.log('self template updated');
                location.reload();
            });
        }
        `;
    }

    let htmlFile = someTypeModuleOfFile(this.resourcePath, ['html']);
    if (htmlFile) {
        // this.addDependency(htmlFile.path);
        content = injectTemplateRender + content + `;require('!!vm-loader?+inner!./index.html');`;
    }

    if (String(query.local) === 'true' && query.type === 'page') {
        let pageName = (this.resourcePath.replace(/(\\)+/g, '/').match(/(?:.*?)\/([0-9a-zA-Z$_-]+)\/[0-9a-zA-Z$_-]+\.js/) || [])[1];
        let pageMock = path.resolve(process.cwd(), `./mock/page-${pageName}.json`);
        if (fs.existsSync(pageMock)) {
            // this.addDependency(pageMock);
            pageMock = path.relative(path.dirname(this.resourcePath), pageMock).replace(/(\\)+/g, '/');
            console.log(`${pageMock} listened`);
            content = `if (module.hot) {
                require('${pageMock}');
                module.hot.accept(['${pageMock}'], function () {
                    console.log('page mock data updated');
                    location.reload();
                });
            } ${content};`;
        }
    }

    return content;
};
