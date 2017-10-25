# mpa-ssr

Multi-page Application Server-side Rendering，多页面后端渲染。

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

## 构建

### 生产环境

建议：pre、prod环境。

```bash
npm run build
```

### 测试环境

不压缩代码。建议：dev、test环境。

```bash
npm run build:devel
```

### 本地开发环境

结合mock数据，使用Webpack DevServer和热加载，本地开发调试。建议：本地环境。

```bash
npm run build:local -- page_name
```

## 测试

### Service Worker

1. 在dist/page目录下，执行`python -m SimpleHTTPServer 3001`；
1. 在test目录下，执行`sh ./sslcert.sh`；
1. 在根目录下，执行`npm run test:server`；
1. 参考[博客](http://deanhume.com/home/blogpost/testing-service-workers-locally-with-self-signed-certificates/10155)打开Chrome；
1. 在Chrome中打开`http://127.0.0.1:3001/detail.html`，查看ServiceWorker缓存情况。
