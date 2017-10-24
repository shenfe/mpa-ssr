require('static/common.css');
require('./index.css');
require('static/lib/jquery.js');
require('script/app.js');

var moduleDetail = require('module/detail/index.js');

$(function () {
    moduleDetail($('[module="detail"]'));
});
