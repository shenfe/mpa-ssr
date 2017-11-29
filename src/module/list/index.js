const EBUS = require('script/util/pubsub');

let $target;

// 监听外部事件
EBUS.on('logout', function (data) {
    console.log('user log out', data);
});
EBUS.on('login', function (data) {
    console.log('user log in', data);
});

module.exports = function ($container) {
    $target = $container;
};
