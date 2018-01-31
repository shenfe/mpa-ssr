const fs = require('fs');
const path = require('path');

const loaderUtils = require('loader-utils');

const { templateExtract } = require('../helper.js');

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
    // this.cacheable(false);
    let query = (loaderUtils.getOptions ? loaderUtils.getOptions(this) : loaderUtils.parseQuery(this.query)) || {};
    console.log(query);

    this.cacheable && this.cacheable();
    this.value = content;
    console.log(`"${this.resourcePath}" loaded`);
    content = templateExtract(this.resourcePath);
    // console.log(`it requires `, content.require);

    let relativePath = r => ('./' + path.relative(path.dirname(this.resourcePath), r).replace(/\\/g, '/'));

    let relativeRequires = [];

    let requires = [];

    let _this = this;
    content.require.forEach(function (r) {
        _this.addDependency(r);
        let rr = relativePath(r);
        relativeRequires.push(rr);
        requires.push(`require('!!vm-loader?+inner!${rr}')`);
    });

    let styleFile = someTypeModuleOfFile(this.resourcePath, ['css', 'scss', 'sass']);
    if (styleFile) {
        // this.addDependency(styleFile.path);
        requires.push(`require('./${styleFile.name}')`);
    }

    let selfTmplFile = `./${path.basename(this.resourcePath)}`;
    let subTmplFiles = relativeRequires;
    // console.log('selfTmplFile', selfTmplFile);
    // console.log('subTmplFiles', subTmplFiles);
    // console.log('requires', requires);
    return `
        ${requires.join(';')};
        if (module.hot) {
            /*
            module.hot.accept(['${selfTmplFile}'], function () {
                console.log('self template updated');
                location.reload();
            });
            */
            module.hot.accept(${JSON.stringify(subTmplFiles)}, function () {
                console.log('sub template updated');
                location.reload();
            });
        }
        module.exports=${query.inner ? '""' : JSON.stringify(content.output)};
    `;
};
