require('static/common.css');
// require('./index.css');
require('script/app.js');

var moduleDetail = require('module/detail/index.js');

$(function () {
    moduleDetail($('[module="detail"]'));
});
