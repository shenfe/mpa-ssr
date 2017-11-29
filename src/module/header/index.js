const EBUS = require('script/util/pubsub');

// 状态数据
let logStatus;

// dom
let el;

module.exports = function () {
    el = document.getElementById('header');
    logStatus = el.getAttribute('data-status') === 'true';

    el.querySelector('[node-type="logio"]').addEventListener('click', function (e) {
        logStatus = !logStatus;
        this.innerHTML = logStatus ? 'logout' : 'login';

        // 触发事件
        EBUS.trigger(logStatus ? 'login' : 'logout', logStatus ? {
            uid: 123,
            username: 'Tom'
        } : undefined);
    });
};
