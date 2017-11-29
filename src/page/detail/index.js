require('static/common.css');
require('script/app.js');

const header = require('module/header/index.js');
const moduleDetail = require('module/detail/index.js');

$(function () {
    header();
    moduleDetail($('[module="detail"]'));
});
