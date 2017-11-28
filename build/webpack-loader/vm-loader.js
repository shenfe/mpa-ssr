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

    return `
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
