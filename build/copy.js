const shell = require('shelljs');

shell.mkdir('-p', './dist');
shell.mkdir('-p', './dist/page');
shell.mkdir('-p', './dist/resource');

shell.cp('-rf', './src/*', './dist/resource');
