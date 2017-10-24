require('./index.css');

var detailTmpl = require('./detail.html');

var detailDataFetcher =
    fetch('//your-domain.com/api/getDetail')
    .then(res => res.json())
    .then(res => {
        if (res.code === 200) {
            console.log('[SUCCESS] to fetch data.');
            return res.data;
        } else {
            console.error('[ERROR] to fetch data.');
        }
    });

module.exports = function ($container) {
    detailDataFetcher.then(({ username, gender }) => {
        $container.innerHTML = window.VTE.render(detailTmpl, { name: username, sex: gender });
    });
};