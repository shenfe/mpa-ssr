const args = process.argv.slice(2);
const inputPages = [];
const options = {
    level: 'm'
};

const fs = require('fs');
const path = require('path');
require('shelljs/global');

args.forEach(function (val, index, array) {
    switch (val) {
    case '-t':
        options.level = 't';
        break;
    case '-m':
        options.level = 'm';
        break;
    default:
        inputPages.push(val);
    }
});

// console.log('Options: ', options);

const pages = inputPages.length ? inputPages : Object.keys(require('./helper.js').getPagesEntry());

const { cwd, readFile, matchReg } = require('./helper');

const srcPath = path.resolve(cwd, 'src');

const dependencyExtract = absFilePath => {
    let tmpl = readFile(absFilePath);
    let deps = {};

    let findDeps = matchReg(tmpl, /(?:#parse(Tmpl|Module)\(")([^()]+)(?:"\))/g);
    findDeps.forEach(p => {
        let dep, depFile;
        if (p[1] === 'Module') {
            depFile = path.resolve(cwd, `src/module/${p[2]}/index.html`);
            dep = `[module] ${p[2]}`;
        } else {
            depFile = (p[2].charAt(0) === '/') ? path.resolve(cwd, 'src' + p[2]) : path.resolve(path.dirname(absFilePath), p[2]);
            dep = depFile.slice(srcPath.length + 1);
        }
        dep = dep.replace(/\\/g, '/');
        if (deps[dep]) return;
        if (options.level === 'm' && p[1] !== 'Module') return;
        deps[dep] = dependencyExtract(depFile);
    });

    return deps;
};

const result = {};

// console.log('Pages: ', pages);

pages.forEach(p => {
    result[`[page] ${p}`] = dependencyExtract(path.resolve(cwd, `src/page/${p}/index.html`));
});

const treeify = require('treeify');

console.log(
    treeify.asTree(result, true)
);
