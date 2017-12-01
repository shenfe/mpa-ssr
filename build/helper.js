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

    // console.log(ps);
    return ps;
};

const templateExtract = (absFilePath, data, local) => {
    let tmpl = read(absFilePath);
    let deps = {};
    let findParseTmpls = matchReg(tmpl, /(?:#parseTmpl\(")([^()]*)(?:"\))/g)
        .concat(matchReg(tmpl, /(?:#parseTmpl\(')([^()]*)(?:'\))/g));
    let findParseModules = matchReg(tmpl, /(?:#parseModule\(")([^()]*)(?:"\))/g)
        .concat(matchReg(tmpl, /(?:#parseModule\(')([^()]*)(?:'\))/g));
    findParseTmpls.forEach(p => {
        let dep = (p[1].charAt(0) === '/') ? path.resolve(cwd, 'src' + p[1]) : path.resolve(path.dirname(absFilePath), p[1]);
        deps[dep] = true;
        let t = templateExtract(dep);
        t.require.forEach(r => {
            deps[r] = true;
        });
        tmpl = tmpl.replaceAll(p[0], t.output);
    });
    findParseModules.forEach(p => {
        let dep = path.resolve(cwd, 'src/module/' + p[1] + '/index.html');
        deps[dep] = true;
        let t = templateExtract(dep);
        t.require.forEach(r => {
            deps[r] = true;
        });
        tmpl = tmpl.replaceAll(
            p[0],
            `<div module="${p[1]}">` + (local ? `<div id="placeholder-${p[1]}"></div>` : t.output) + `</div>`
        );
    });

    if (data) {
        tmpl = render(tmpl, data);
    }

    return {
        require: Object.keys(deps),
        context: data,
        output: tmpl
    };
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
