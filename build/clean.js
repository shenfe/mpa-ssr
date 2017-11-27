const shell = require('shelljs');

shell.rm('-f', './dist/*');
shell.rm('-rf', './dist/page/*');
shell.rm('-rf', './dist/resource/*');
