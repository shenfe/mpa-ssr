const { templateExtract } = require('../helper.js');

module.exports = function (content) {
    this.cacheable && this.cacheable();
    this.value = content;
    console.log(`vm-loader is loading "${this.resourcePath}"`);
    content = templateExtract(this.resourcePath);
    return `
        if (module.hot) {
            module.hot.accept();
            module.hot.accept(${JSON.stringify(content.require)}, function () {
                // callback
            });
        };
        module.exports=${JSON.stringify(content.output)};
    `;
};
