const loaderUtils = require('loader-utils');
const Px2rem = require('px2rem');

module.exports = function (source) {
    let query = loaderUtils.getOptions(this) || {};
    let px2remIns = new Px2rem(query);
    let output = (query.remVersion === true || query.threeVersion === false) ? px2remIns.generateRem(source) : px2remIns.generateThree(source);
    return output;
};
