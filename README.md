# multi-page-ssr

多页面后端渲染。

## 项目结构

路径 | 内容
:---: | :---
src | 项目源码
src/module | 模块
src/page | 页面
src/script | 公用逻辑和组件
src/snippet | 碎片模板
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
