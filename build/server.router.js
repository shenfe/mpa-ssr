const convert = (page, option) => {
    return typeof option === 'string' ?
        `${option}${page}.html` :
        (typeof option === 'function' ?
            option(page) :
            `/${page}`);
};

module.exports = option => {
    return [
        // 【示例】路由
        {
            from: /\/\d+/,
            to: convert('detail', option)
        }
    ];
};
