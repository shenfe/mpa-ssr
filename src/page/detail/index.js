require('static/common.css');
require('script/app.js');

const moduleDetail = require('module/detail/index.js');

$(function () {
    moduleDetail($('[module="detail"]'));
});
