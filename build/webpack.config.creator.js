const Webpack = require('webpack');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const fs = require('fs');
const path = require('path');

const projConf = require('./config');

const ejs = require('ejs');

const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const { cwd, isProduction, getPagesEntry, templateExtract, readData } = require('./helper');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer');

const devServerConfig = require('./server.config');
const publicPath = devServerConfig.publicPath;

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const vendorFiles = fs.readdirSync(path.resolve(cwd, `dist/resource/${projConf.vendorPath}`)).map(file => {
    if (/\.js$/.test(file)) return `${projConf.vendorPath}/${file}`;
    return null;
}).filter(Boolean);
console.log('vendor files', vendorFiles);

const htmlWebpackPluginCreator = (entries, { local }, publicPath) =>
    Object.keys(entries).map(p =>
        new HtmlWebpackPlugin({
            filename: local ? `${p}.html` : `../page/${p}.html`,
            inject: false,
            excludeChunks: Object.keys(entries).filter(q => p !== q),
            templateContent: templateParams => {
                let tmpl = templateExtract(
                    path.resolve(cwd, `src/page/${p}/index.html`),
                    local && Object.assign({
                        resourceURL: publicPath
                    }, readData(path.resolve(cwd, `mock/page-${p}.json`)))
                );
                return ejs.compile(tmpl)(Object.assign({
                    resourceURL: publicPath,
                    vendorFiles: vendorFiles
                }, templateParams));
            }
        })
    );

const extractTextOptions = sass => ({
    fallback: 'style-loader',
    use: [
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                plugins: (loader) =>
                    [require('autoprefixer')()]
            }
        },
        ...(sass ? ['sass-loader'] : [])
    ]
});

module.exports = (specifiedEntries, options = {}) => {
    const pathPrefix = 'build/';
    let entries = getPagesEntry(specifiedEntries, options, devServerConfig);
    let isPro = isProduction();

    let extractPageCss = new ExtractTextPlugin(`${pathPrefix}[name]/[name].[contenthash:7].css`);
    let extractCommonCss = new ExtractTextPlugin(`${pathPrefix}common/common.[contenthash:7].css`);

    return {
        devtool: options.local ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
        target: 'web',
        devServer: options.local ? devServerConfig : undefined,
        context: path.resolve(cwd, 'src'),
        entry: Object.assign(entries, {}),
        output: {
            path: path.resolve(cwd, 'dist/resource'),
            publicPath: publicPath, // dev-server访问的路径
            filename: options.local ? `${pathPrefix}[name]/[name].[hash:7].js` : `${pathPrefix}[name]/[name].[chunkhash:7].js`
        },
        // externals: {
        //     jquery: 'jQuery'
        // },
        resolve: {
            modules: [
                path.resolve(cwd, 'src/static/lib'),
                'node_modules'
            ],
            alias: {
                module: path.resolve(cwd, 'src/module/'),
                page: path.resolve(cwd, 'src/page/'),
                script: path.resolve(cwd, 'src/script/'),
                snippet: path.resolve(cwd, 'src/snippet/'),
                static: path.resolve(cwd, 'src/static/')
            }
        },
        watch: false, // options.local,
        performance: {
            hints: options.local ? false : 'warning', // 当资源不符合性能规则时，以什么方式进行提示
            maxAssetSize: 400000, // 单个资源允许的最大文件容量，单位：字节，默认250kb
            maxEntrypointSize: 800000, // 单个入口模块引用的所有资源的最大文件容量，单位：字节，默认250kb
            assetFilter: function (assetFilename) { // 控制哪些文件需要进行性能检测
                return /\.(css|js)$/.test(assetFilename);
            }
        },
        stats: isPro ? 'none' : 'verbose',
        module: {
            rules: [
                {
                    test: /\.js[x]?$/,
                    exclude: [
                        path.resolve(cwd, './node_modules')
                    ],
                    use: ['babel-loader']
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2)$/,
                    use: ['url-loader']
                },
                {
                    test: /\.(vm|html)$/,
                    use: ['raw-loader']
                },
                {
                    test: /\.(css)$/,
                    include: [
                        path.resolve(cwd, 'src/module'),
                        path.resolve(cwd, 'src/page')
                    ],
                    use: extractPageCss.extract(extractTextOptions())
                },
                {
                    test: /\.(sass|scss)$/,
                    include: [
                        path.resolve(cwd, 'src/module'),
                        path.resolve(cwd, 'src/page')
                    ],
                    use: extractPageCss.extract(extractTextOptions(true))
                },
                {
                    test: /\.(css)$/,
                    include: [
                        path.resolve(cwd, 'src/static')
                    ],
                    use: extractCommonCss.extract(extractTextOptions())
                },
                {
                    test: /\.(sass|scss)$/,
                    include: [
                        path.resolve(cwd, 'src/static')
                    ],
                    use: extractCommonCss.extract(extractTextOptions(true))
                }
            ]
        },
        recordsPath: path.resolve(cwd, 'build/recordsPath.json'),
        plugins: [
            ...((options.buildTogether && options.bundleAnalyse) ? [new BundleAnalyzerPlugin()] : []),
            new Webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new Webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./vendor-manifest.json') // 引入vendor-manifest文件
            }),
            new Webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: options.local ? `${pathPrefix}[name]/[name].[hash:7].js` : `${pathPrefix}[name]/[name].[chunkhash:7].js`,
                minChunks: function (module, count) {
                    if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                        return false;
                    }
                    return (module.context && module.context.indexOf('node_modules') !== -1)
                        || (module.resource && module.resource.split('\\').join('/').indexOf('src/static/lib') !== -1);
                }
            }),
            extractCommonCss,
            extractPageCss,
            ...(isPro ? [new OptimizeCssAssetsPlugin()] : []),
            ...htmlWebpackPluginCreator(entries, options, publicPath),
            ...(isPro ? [new Webpack.optimize.UglifyJsPlugin()] : []),
            ...(options.local ? [new Webpack.HotModuleReplacementPlugin()] : []),
            new SWPrecacheWebpackPlugin(
                {
                    cacheId: projConf.projName,
                    dontCacheBustUrlsMatching: /.*/, // 重要
                    minify: isPro,
                    navigateFallback: publicPath,
                    mergeStaticsConfig: true,
                    stripPrefixMulti: {
                        'dist': ''
                    },
                    staticFileGlobs: vendorFiles.map(file => `dist/resource/${file}`),
                    staticFileGlobsIgnorePatterns: [/\.html$/, /\.map$/, /asset-manifest\.json$/]
                }
            ),
            function (compiler) {
                this.plugin('done', function () {
                    options.done && options.done();
                });
            }
        ]
    };
};
