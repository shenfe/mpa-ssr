var EBUS = require('script/util/pubsub');

var header = require('module/header/index.js');

EBUS.on('logout', function (data) {
    // ...
});

module.exports = function ($container) {
    header(document.querySelector('#header'));
};