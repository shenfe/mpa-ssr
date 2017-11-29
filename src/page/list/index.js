require('static/common.css');
require('script/app.js');

const header = require('module/header/index.js');
const moduleList = require('module/list/index.js');

$(function () {
    header();
    moduleList($('[module="list"]'));
});
