# mpa-ssr

Multi-Page Application Server-Side Rendering，多页面后端渲染。

## 1 架构特性

1. 多页面，后端直出数据渲染模板生成页面，SEO友好
1. 模板同构，前后端使用相同模板，前端无缝开发调试
1. 面向页面和组件开发，并支持碎片，（页面/组件/模板/样式表）自由构造组合，主张局部按需提升
1. 关注面分离，代码文件路径体现代码职责
1. 支持Px2rem + DPR方案做（移动端）样式适配
1. 支持PWA的Service Worker用于浏览器缓存
1. Webpack资源打包，代码切分，静态资源文件遵从**文件名变当且仅当文件变**的原则，支持强缓存
1. WebpackDevServer + HMR + Mock数据 + 接口代理 + 路由，本地快速开发
1. 默认配置Babel转译JS代码，默认配置Sass和Postcss处理CSS
1. 默认面向移动端，可以兼容桌面端

## 2 项目结构

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
test | 测试服务

## 3 快速命令

### 3.1 构建并启动本地开发环境

```bash
npm run clean && npm run build:dll && npm run build:local
```

### 3.2 构建线上环境代码并在本地预览

```bash
npm run clean && npm run build:dll && npm run build && npm run serve
```

### 3.3 在终端树状打印页面和组件依赖

打印所有页面所有模块依赖：

```bash
npm run tree
```

默认只打印页面和模块，如果需要显示到模板的粒度，加`-t`选项：

```bash
npm run tree -- -t
```

如果只需查看特定页面，加页面名：

```bash
npm run tree -- page_name
```

## 4 快速配置

在`build/config.json`中，`resourceVisitPath`选项是静态资源的路径，在构建非本地环境时，修改为需要的路径，如`//res-domain.com/proj-res-dir/`。

## 5 构建

### 5.1 第三方库Dll打包

```bash
npm run build:dll
```

### 5.2 生产环境

建议环境：pre、prod。

```bash
npm run build
```

如果只需要构建某一页面，则指定该页面：

```bash
npm run build -- page_name
```

### 5.3 测试环境

不压缩代码。建议环境：dev、test。

```bash
npm run build:devel
```

如果只需要构建某一页面，则指定该页面。

### 5.4 本地开发环境

结合mock数据，使用Webpack DevServer和热加载，本地开发调试。

```bash
npm run build:local
```

如果只需要构建某一页面，则指定该页面。

## 6 服务

本地服务支持Mock接口、代理接口和路由，用于开发和测试。本地服务分两种情况，本地开发模式下随Webpack启动的Webpack DevServer，本地测试模式下（构建了非本地环境的代码后想要本地预览和测试）手动启动的服务器。

### 6.1 本地开发服务

如果是本地开发环境，则默认使用Webpack DevServer，在构建命令执行时会自动启动。

### 6.2 本地测试服务

如果已经构建了测试或正式环境的代码，想要预览效果，则手动启动本地测试服务，即执行：

```
npm run serve
```

### 6.3 接口

在`build/server.config.js`中，`before(app)`配置Mock接口，`proxy`配置代理接口。

### 6.4 Mock数据

Mock数据可以额外定义在`mock`文件夹中。Mock数据分两种，页面直出数据、接口数据。

页面直出数据在两个时候被使用：

1. 本地开发模式下，在Webpack编译时，html-webpack-plugin插件将页面模板与页面Mock数据合成html
2. 本地测试模式下，服务器对每个页面名称提供对应接口，返回页面模板与页面Mock数据合成的html

对于页面直出数据，建议遵循`page-${page_name}.json`的命名规则。

### 6.5 路由

在`build/server.router.js`中配置路由。

## 7 代码提示

默认配置ESLint。

## 8 代码切分

存在分开打包需求的代码包括：

1. 第三方库
1. 跨页面的公共逻辑
1. 页面内的业务逻辑

对于第三方库，使用externals和DllPlugin；使用DllPlugin需注意，在将dll包build完毕后再执行业务代码打包和DevServer。

对于公共逻辑代码，使用CommonsChunkPlugin。

## 9 使用Service Worker

Service Worker的使用是可选的。如果不需要，则在`build/config.json`配置文件中将`serviceWorker`置为`false`。

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
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --unsafely-treat-insecure-origin-as-secure=https://app-domain.com,https://res-domain.com --user-data-dir="D:\foo" https://app-domain.com
```

## 10 兼容桌面端

*一般地，将桌面端俗称PC，将移动端俗称Wap或H5。*

如果是PC端并且需要兼容IE8-，那么需要调整部分文件。需要调整的文件都在自身所在目录下存在另一个同名（但名称中多出`ie`标识）文件，进行替换即可。

## 11 开发

参照示例。

由于面向页面和组件开发，开发代码主要涉及三个目录：

1. `page`目录，每个页面一个文件夹
1. `module`目录，每个模块（组件）一个文件夹
1. `script`目录，公用脚本
