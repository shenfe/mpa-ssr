const EBUS = require('script/util/pubsub');

const detailTmpl = require('./detail.html');

const $assert = require('azzert');

let $target;

// 监听外部事件
EBUS.on('logout', function (data) {
    console.log('user log out', data);
});
EBUS.on('login', function (data) {
    console.log('user log in', data);
});

// 请求数据
const fetchDetail = fetch('/api/getDetail')
    .then(res => res.json())
    .then(res => {
        if ($assert(res, {
            code: _ => _ === 200,
            data: {
                username: 's',
                gender: 's'
            }
        })) {
            return res.data;
        }
        throw new Error('got wrong data');
    });

module.exports = function ($container) {
    $target = $container;
    fetchDetail
        .then(data => {
            $target
                .find('[node-type="the-detail"]')
                .html(window.VTE.render(detailTmpl, { name: data.username, sex: data.gender }));
        })
        .catch(err => console.error(err));
};
