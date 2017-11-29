# mpa-ssr

Multi-page Application Server-side Rendering，多页面后端渲染。

## 架构特性

1. 多页面，后端控制路由，渲染页面数据直出，SEO友好
1. 模板同构，前后端使用相同模板文件，前端无缝调试
1. 支持模板文件碎片，更高的自由度和可复用性
1. 支持PWA的Service Worker缓存
1. 面向页面和组件开发，组件可自由构造、组合，主张局部架构按需提升
1. 关注面分离，约束代码职责
1. Webpack资源打包，代码切分，遵从文件名变当且仅当文件变的原则
1. Webpack DevServer + 热替换，本地快速开发
1. 移动端可基于px2rem方案做样式适配

## 项目结构

路径 | 内容
:--- | :---
src | 项目源码
src/module | 模块（组件）
src/page | 页面
src/script | 公用逻辑
src/snippet | 碎片文件
src/static | 公用静态文件
dist | 发布文件
mock | 开发测试数据
build | 构建脚本

## 主要命令

### 构建并启动本地开发环境

```bash
npm run clean && npm run build:dll && npm run build:local
```

### 构建线上环境代码并在本地预览

```bash
npm run clean && npm run build:dll && npm run build && npm run serve
```

## 构建

### 第三方库Dll打包

```bash
npm run build:dll
```

### 生产环境

建议环境：pre、prod。

```bash
npm run build
```

### 测试环境

不压缩代码。建议环境：dev、test。

```bash
npm run build:devel
```

### 本地开发环境

结合mock数据，使用Webpack DevServer和热加载，本地开发调试。

```bash
npm run build:local -- page_name
```

## 本地服务

如果是本地开发环境，则默认使用Webpack DevServer。

如果想预览测试或正式环境的效果，则在build之后执行：

```
npm run serve
```


## 代码分离

存在分开打包需求的代码包括：

1. 第三方库
1. 不依赖页面的公共逻辑
1. 页面的业务逻辑

对于第三方库，推荐使用externals和DllPlugin；使用DllPlugin需注意，在将dll包build完毕后再执行业务代码打包和DevServer。

对于公共逻辑代码，推荐使用CommonsChunkPlugin。

## 使用Service Worker

Service Worker的使用是可选的。如果不需要，则：1) 在Webpack配置的插件中将SWPrecacheWebpackPlugin移除，2) 在snippet/head.html中将加载Service Worker的脚本标签移除。

生产环境和测试环境下，建议在项目域根路经下代理`service-worker.js`文件和其他静态资源。

```
location /service-worker.js {
    proxy_pass http://cdn-domain.com/resource-dir/service-worker.js;
    break;
}
location /resource-dir/ {
    proxy_pass http://cdn-domain.com/resource-dir/;
    break;
}
```

当然，最好再在请求响应头里加上缓存相关的头。只要秉持“文件名变当且仅当文件变”的打包原则，缓存过期时间可以设置足够久。如果允许的话，还可以给项目域的resource-dir路径配置cdn缓存，并且足够久。

测试环境如果SSL证书不受信，可以命令行带参数打开Chrome，让Chrome信任项目源和cdn源：

```
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --unsafely-treat-insecure-origin-as-secure=https://app-domain.com,https://cdn-domain.com --user-data-dir="D:\foo" https://app-domain.com
```
