require('static/common.css');
require('script/app.js');

const moduleList = require('module/list/index.js');

$(function () {
    moduleList($('[module="list"]'));
});
