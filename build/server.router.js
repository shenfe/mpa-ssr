module.exports = rootPath => {
    let convert = page => {
        return typeof rootPath === 'string' ?
            `${rootPath}${page}.html` :
            (typeof rootPath === 'function' ?
                rootPath(page) :
                `/${page}`);
    };
    return [
        // 【示例】路由
        {
            from: /\/\d+/,
            to: convert('detail')
        }
    ];
};
