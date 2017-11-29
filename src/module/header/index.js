const EBUS = require('script/util/pubsub');

// 状态数据
let logStatus;

// dom
let el;

module.exports = function () {
    el = document.getElementById('header');
    logStatus = el.getAttribute('data-status') === 'true';

    // 事件绑定
    el.querySelector('[node-type="logio"]').addEventListener('click', function (e) {
        logStatus = !logStatus;
        this.innerHTML = logStatus ? 'Sign out' : 'Sign in';

        // 触发事件
        EBUS.trigger(logStatus ? 'login' : 'logout', logStatus ? {
            uid: 123
        } : undefined);
    });
};
