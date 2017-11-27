require('static/common.css');
// require('./index.css');
require('script/app.js');

var moduleList = require('module/list/index.js');

$(function () {
    moduleList($('[module="list"]'));
});
