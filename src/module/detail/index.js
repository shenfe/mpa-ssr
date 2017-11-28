const detailTmpl = require('./detail.html');

const $assert = require('azzert');

const detailDataFetcher =
    fetch('/api/getDetail')
        .then(res => res.json())
        .then(res => {
            if ($assert(res, {
                username: 's',
                gender: 's'
            })) {
                return res;
            }
            throw new Error('got wrong data');
        });

module.exports = function ($container) {
    detailDataFetcher
        .then(({ username, gender }) => {
            $container.html(window.VTE.render(detailTmpl, { name: username, sex: gender }));
        })
        .catch(err => console.error(err));
};
