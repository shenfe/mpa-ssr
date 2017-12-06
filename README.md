<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [mpa-ssr](#mpa-ssr)
    - [1 架构特性](#1-%E6%9E%B6%E6%9E%84%E7%89%B9%E6%80%A7)
    - [2 项目结构](#2-%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84)
    - [3 快速开发](#3-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%8F%91)
    - [4 快速命令](#4-%E5%BF%AB%E9%80%9F%E5%91%BD%E4%BB%A4)
        - [4.1 构建并启动本地开发环境](#41-%E6%9E%84%E5%BB%BA%E5%B9%B6%E5%90%AF%E5%8A%A8%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83)
        - [4.2 构建线上环境代码并在本地预览](#42-%E6%9E%84%E5%BB%BA%E7%BA%BF%E4%B8%8A%E7%8E%AF%E5%A2%83%E4%BB%A3%E7%A0%81%E5%B9%B6%E5%9C%A8%E6%9C%AC%E5%9C%B0%E9%A2%84%E8%A7%88)
        - [4.3 在终端树状打印页面和组件依赖](#43-%E5%9C%A8%E7%BB%88%E7%AB%AF%E6%A0%91%E7%8A%B6%E6%89%93%E5%8D%B0%E9%A1%B5%E9%9D%A2%E5%92%8C%E7%BB%84%E4%BB%B6%E4%BE%9D%E8%B5%96)
    - [5 快速配置](#5-%E5%BF%AB%E9%80%9F%E9%85%8D%E7%BD%AE)
    - [6 构建](#6-%E6%9E%84%E5%BB%BA)
        - [6.1 第三方库Dll打包](#61-%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93dll%E6%89%93%E5%8C%85)
        - [6.2 生产环境](#62-%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83)
        - [6.3 测试环境](#63-%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83)
        - [6.4 本地开发环境](#64-%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83)
    - [7 服务](#7-%E6%9C%8D%E5%8A%A1)
        - [7.1 本地开发服务](#71-%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E6%9C%8D%E5%8A%A1)
        - [7.2 本地测试服务](#72-%E6%9C%AC%E5%9C%B0%E6%B5%8B%E8%AF%95%E6%9C%8D%E5%8A%A1)
        - [7.3 接口](#73-%E6%8E%A5%E5%8F%A3)
        - [7.4 Mock数据](#74-mock%E6%95%B0%E6%8D%AE)
        - [7.5 路由](#75-%E8%B7%AF%E7%94%B1)
    - [8 代码提示](#8-%E4%BB%A3%E7%A0%81%E6%8F%90%E7%A4%BA)
    - [9 代码切分](#9-%E4%BB%A3%E7%A0%81%E5%88%87%E5%88%86)
    - [10 使用Service Worker](#10-%E4%BD%BF%E7%94%A8service-worker)
    - [11 兼容桌面端](#11-%E5%85%BC%E5%AE%B9%E6%A1%8C%E9%9D%A2%E7%AB%AF)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

## 3 快速开发

由于面向页面和组件开发，开发代码主要涉及三个目录：

1. `page`目录，每个页面一个文件夹
    * 每个页面下，index.html为页面模板入口，index.js为页面逻辑入口
1. `module`目录，每个模块（组件）一个文件夹
    * 每个模块下，index.html为模块模板入口，index.js为模块逻辑入口（导出一个初始化函数）
1. `script`目录，公用脚本
    * 建议根据业务逻辑相关性作子目录区分，例如helper目录是业务逻辑相关的公用逻辑，util目录是业务逻辑无关的工具和辅助

开发可参照src中示例。示例包含2个页面（列表页和详情页），共3个模块（头部模块、列表模块、详情模块）。

## 4 快速命令

### 4.1 构建并启动本地开发环境

```bash
npm run clean && npm run build:dll && npm run build:local
```

### 4.2 构建线上环境代码并在本地预览

```bash
npm run clean && npm run build:dll && npm run build && npm run serve
```

### 4.3 在终端树状打印页面和组件依赖

打印所有页面所有模块依赖：

```bash
npm run tree
```

例如对于示例，输出：

```
  ├─ [page] detail
  │  ├─ [module] header
  │  └─ [module] detail
  └─ [page] list
     ├─ [module] header
     └─ [module] list
```

默认只打印页面和模块，如果需要显示到模板的粒度，加`-t`选项：

```bash
npm run tree -- -t
```

例如对于示例，输出：

```
├─ [page] detail
│  ├─ snippet/head.html
│  │  ├─ snippet/meta.html
│  │  └─ snippet/css.ejs
│  ├─ [module] header
│  ├─ [module] detail
│  │  └─ module/list/item.html
│  └─ snippet/js.ejs
└─ [page] list
   ├─ snippet/head.html
   │  ├─ snippet/meta.html
   │  └─ snippet/css.ejs
   ├─ [module] header
   ├─ [module] list
   │  └─ module/list/list.html
   │     └─ module/list/item.html
   └─ snippet/js.ejs
```

如果只需查看特定页面，加页面名：

```bash
npm run tree -- page_name
```

例如对于示例中的list页面，输出：

```
└─ [page] list
   ├─ [module] header
   └─ [module] list
```

## 5 快速配置

在`build/config.json`中，`resourceVisitPath`选项是静态资源的路径，在构建非本地环境时，修改为需要的路径，如`//res-domain.com/res-dir/`。

## 6 构建

### 6.1 第三方库Dll打包

```bash
npm run build:dll
```

### 6.2 生产环境

建议环境：pre、prod。

```bash
npm run build
```

如果只需要构建某一页面，则指定该页面：

```bash
npm run build -- page_name
```

### 6.3 测试环境

不压缩代码。建议环境：dev、test。

```bash
npm run build:devel
```

如果只需要构建某一页面，则指定该页面。

### 6.4 本地开发环境

结合mock数据，使用Webpack DevServer和热加载，本地开发调试。

```bash
npm run build:local
```

如果只需要构建某一页面，则指定该页面。

## 7 服务

本地服务支持Mock接口、代理接口和路由，用于开发和测试。本地服务分两种情况，本地开发模式下随Webpack启动的Webpack DevServer，本地测试模式下（构建了非本地环境的代码后想要本地预览和测试）手动启动的服务器。

### 7.1 本地开发服务

如果是本地开发环境，则默认使用Webpack DevServer，在构建命令执行时会自动启动。

### 7.2 本地测试服务

如果已经构建了测试或正式环境的代码，想要预览效果，则手动启动本地测试服务，即执行：

```
npm run serve
```

### 7.3 接口

在`build/server.config.js`中，`before(app)`配置Mock接口，`proxy`配置代理接口。

### 7.4 Mock数据

Mock数据可以额外定义在`mock`文件夹中。Mock数据分两种，页面直出数据、接口数据。

页面直出数据在两个时候被使用：

1. 本地开发模式下，在Webpack编译时，html-webpack-plugin插件将页面模板与页面Mock数据合成html
2. 本地测试模式下，服务器对每个页面名称提供对应接口，返回页面模板与页面Mock数据合成的html

对于页面直出数据，建议遵循`page-${page_name}.json`的命名规则。

### 7.5 路由

在`build/server.router.js`中配置路由。

## 8 代码提示

默认配置ESLint和StyleLint，并且配置pre-commit。

如果git commit时报以下错：

```
: No such file or directory 2: ./node_modules/pre-commit/hook
```

则尝试换用终端，如Windows下可使用git bash。

## 9 代码切分

存在分开打包需求的代码包括：

1. 第三方库
1. 跨页面的公共逻辑
1. 页面内的业务逻辑

对于第三方库，使用externals和DllPlugin；使用DllPlugin需注意，在将dll包build完毕后再执行业务代码打包和DevServer。

对于公共逻辑代码，使用CommonsChunkPlugin。

## 10 使用Service Worker

Service Worker的使用是可选的。如果不需要，则在`build/config.json`配置文件中将`serviceWorker`置为`false`。

生产环境和测试环境下，建议在项目域根路经下代理`service-worker.js`文件和其他静态资源。

```
location /service-worker.js {
    proxy_pass http://res-domain.com/res-dir/service-worker.js;
    break;
}
location /resource-dir/ {
    proxy_pass http://res-domain.com/res-dir/;
    break;
}
```

当然，最好再在请求响应头里加上缓存相关的头。只要秉持“文件名变当且仅当文件变”的打包原则，缓存过期时间可以设置足够久。如果允许的话，还可以给项目域的res-dir路径配置cdn缓存，并且足够久。

测试环境如果SSL证书不受信，可以命令行带参数打开Chrome，让Chrome信任项目源和cdn源：

```
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --unsafely-treat-insecure-origin-as-secure=https://app-domain.com,https://res-domain.com --user-data-dir="D:\foo" https://app-domain.com
```

## 11 兼容桌面端

*一般地，将桌面端俗称PC，将移动端俗称Wap或H5。*

如果是PC端并且需要兼容IE8-，那么需要调整部分文件。需要调整的文件都在自身所在目录下存在另一个同名（但名称中多出`ie`标识）文件，进行替换即可。
