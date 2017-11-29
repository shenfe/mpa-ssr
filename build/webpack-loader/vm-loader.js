const fs = require('fs');
const path = require('path');

const { templateExtract } = require('../helper.js');

module.exports = function (content) {
    this.cacheable && this.cacheable();
    this.value = content;
    console.log(`"${this.resourcePath}" loaded`);
    content = templateExtract(this.resourcePath);
    content.require = content.require.map(r => ('./' + path.relative(path.dirname(this.resourcePath), r).replace(/\\/g, '/')));
    console.log('it requires: ', content.require);

    let _this = this;
    content.require.forEach(function (r) {
        _this.addDependency(r);
    });

    let requires = content.require.map(r => `require('${r}')`);

    let fileName = path.basename(this.resourcePath).replace(/\.[a-z]+$/, '');
    let fileStyleType;
    if (fs.existsSync(this.resourcePath.replace(/\.[a-z]+$/, '.css'))) {
        fileStyleType = 'css';
    } else if (fs.existsSync(this.resourcePath.replace(/\.[a-z]+$/, '.scss'))) {
        fileStyleType = 'scss';
    } else if (fs.existsSync(this.resourcePath.replace(/\.[a-z]+$/, '.sass'))) {
        fileStyleType = 'sass';
    }
    if (fileStyleType) {
        this.addDependency(`./${fileName}.${fileStyleType}`);
        requires.push(`require('./${fileName}.${fileStyleType}')`);
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
            module.hot.accept(${JSON.stringify(content.require)}, function () {
                // callback
                console.log('sub template updated');
                location.reload();
            });
        };
        module.exports=${JSON.stringify(content.output)};
    `;
};
