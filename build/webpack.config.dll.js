const path = require('path');
const Webpack = require('webpack');

const projConf = require('./config');

const dllName = 'vendor';
const dllGlobalLibName = `${projConf.projName}_${dllName}`; // 输出的全局变量名

const cwd = process.cwd();

const debug = false;

module.exports = {
    entry: {
        [dllName]: ['jquery', 'velocity-template-engine']
    },
    output: {
        path: path.resolve(cwd, `dist/resource/${projConf.vendorPath}`),
        filename: '[name].[chunkhash:7].js',
        library: dllGlobalLibName
    },
    resolve: {
        modules: [
            path.resolve(cwd, 'src/static/lib'),
            'node_modules'
        ]
    },
    plugins: [
        new Webpack.DllPlugin({
            context: __dirname,
            path: path.resolve(cwd, 'build/[name]-manifest.json'), // [name]为entry名
            name: dllGlobalLibName
        }),
        ...(!debug ? [new Webpack.optimize.UglifyJsPlugin({
            mangle: {
                screw_ie8: false
            },
            mangleProperties: {
                screw_ie8: false,
                ignore_quoted: true
            },
            compress: {
                screw_ie8: false,
                properties: false
            },
            output: {
                screw_ie8: false
            }
        })] : [])
    ]
};
