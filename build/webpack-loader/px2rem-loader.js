var loaderUtils = require('loader-utils');
var Px2rem = require('px2rem');

module.exports = function (source) {
    var query = loaderUtils.getOptions(this) || {};
    var px2remIns = new Px2rem(query);
    var output = (query.remVersion === true || query.threeVersion === false) ? px2remIns.generateRem(source) : px2remIns.generateThree(source);
    return output;
};
