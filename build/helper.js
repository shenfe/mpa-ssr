const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

const getDirs = srcPath => {
    srcPath = path.resolve(__dirname, srcPath || './');
    return fs.readdirSync(srcPath)
        .filter(file => fs.lstatSync(path.resolve(srcPath, file)).isDirectory());
};

const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

const read = fileName => fs.readFileSync(fileName, 'utf8');

const Vte = require('velocity-template-engine');

const render = (template, context) => Vte.render(template, context);

const context = vm => {
    let Ctx = Vte.context;
    let data = (new Ctx()).execute(vm).data;
    for (let i in data) {
        if (!data.hasOwnProperty(i)) continue;
        if (i.startsWith('$') && i !== '$this') {
            data[i.substr(1)] = data[i];
            delete data[i];
        }
    }
    return data;
};

const matchReg = (string, regexp) => {
    let match, result = [];
    while ((match = regexp.exec(string)) != null) {
        result.push(match);
    }
    return result;
};

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
}

const getPagesEntry = (specifiedPages, options = {}, devServer) => {
    let folders = specifiedPages || getDirs(path.resolve(cwd, 'src/page'));
    let ps = folders.reduce((prev, next) => {
        if (options.local && devServer) {
            prev[next] = [
                `webpack-dev-server/client?http${devServer.https ? 's' : ''}://${devServer.host}:${devServer.port}`,
                'webpack/hot/only-dev-server',
                `./page/${next}/index.js`
            ];
        } else {
            prev[next] = `./page/${next}/index.js`;
        }
        return prev;
    }, {});

    console.log(ps);
    return ps;
};

const templateExtract = (absFilePath, data) => {
    let tmpl = read(absFilePath);
    let findParseTmpls = matchReg(tmpl, /(?:#parseTmpl\(")([^()]*)(?:"\))/g)
        .concat(matchReg(tmpl, /(?:#parseTmpl\(')([^()]*)(?:'\))/g));
    let findParseModules = matchReg(tmpl, /(?:#parseModule\(")([^()]*)(?:"\))/g)
        .concat(matchReg(tmpl, /(?:#parseModule\(')([^()]*)(?:'\))/g));
    findParseTmpls.forEach(p => {
        tmpl = tmpl.replaceAll(p[0], templateExtract(path.resolve(cwd, 'src/.' + p[1])));
    });
    findParseModules.forEach(p => {
        tmpl = tmpl.replaceAll(p[0], templateExtract(path.resolve(cwd, 'src/module/' + p[1] + '/index.html')));
    });

    if (data) tmpl = render(tmpl, data);
    return tmpl;
};

const readData = absFilePath => {
    let data;
    try {
        data = fs.existsSync(absFilePath) ?
            JSON.parse(read(absFilePath)) :
            {};
    } catch (e) {
        data = {};
    }
    return data;
};

module.exports = {
    cwd,
    getDirs,
    isProduction,
    readFile: read,
    readData,
    makeFile: render,
    context,
    matchReg,
    getPagesEntry,
    templateExtract
};
