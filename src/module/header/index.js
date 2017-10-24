var EBUS = require('script/util/pubsub');

module.exports = function ($el) {
    $el.querySelector('#logout').addEventListener('click', function (e) {
        EBUS.trigger('logout');
    });
};
