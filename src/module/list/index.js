const EBUS = require('script/util/pubsub');

const header = require('module/header/index.js');

EBUS.on('logout', function (data) {
    // ...
});

const listTmpl = require('./list.html');

module.exports = function ($container) {
    header(document.querySelector('#header'));
    $container.find('#list-container').html(window.VTE.render(listTmpl));
};
