const fs = require('fs');
const path = require('path');

const { templateExtract } = require('../helper.js');

const styleModuleOfFile = p => {
    let fileName = path.basename(p).replace(/\.[a-z]+$/, '');
    let fileStyleType;
    if (fs.existsSync(p.replace(/\.[a-z]+$/, '.css'))) {
        fileStyleType = 'css';
    } else if (fs.existsSync(p.replace(/\.[a-z]+$/, '.scss'))) {
        fileStyleType = 'scss';
    } else if (fs.existsSync(p.replace(/\.[a-z]+$/, '.sass'))) {
        fileStyleType = 'sass';
    }
    if (fileStyleType) return `${fileName}.${fileStyleType}`;
};

module.exports = function (content) {
    this.cacheable && this.cacheable();
    this.value = content;
    console.log(`"${this.resourcePath}" loaded`);
    content = templateExtract(this.resourcePath);
    console.log(`it requires `, content.require);

    let relativePath = r => ('./' + path.relative(path.dirname(this.resourcePath), r).replace(/\\/g, '/'));

    let relativeRequires = content.require.map(relativePath);

    let requires = [];

    let _this = this;
    content.require.forEach(function (r) {
        _this.addDependency(r);
        let styleFile = styleModuleOfFile(r);
        if (styleFile) {
            _this.addDependency(path.dirname(r) + '/' + styleFile);
            let p = relativePath(r);
            requires.push(`require('${path.dirname(p) + '/' + styleFile}')`);
        }
    });

    let styleFile = styleModuleOfFile(this.resourcePath);
    if (styleFile) {
        this.addDependency(`./${styleFile}`);
        requires.push(`require('./${styleFile}')`);
    }

    return `
        ${requires.join(';')};
        if (module.hot) {
            /*
            module.hot.accept('./${path.basename(this.resourcePath)}', function () {
                // callback
                console.log('self template updated');
                location.reload();
            });
            */
            module.hot.accept(${JSON.stringify(relativeRequires)}, function () {
                // callback
                console.log('sub template updated');
                location.reload();
            });
        };
        module.exports=${JSON.stringify(content.output)};
    `;
};
