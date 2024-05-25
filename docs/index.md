# 指南

## 简介

基于 rollup + esbuild 打包器实现代码组件库

## 安装使用

```bash
yarn add library-rollup -S --registry=xxx

# OR

npm install library-rollup -S --registry=xxx
```

::: warning yarn 或 npm i 安装报 Couldn't find package "xxx" on the "npm" registry
在项目根目录添加 .npmrc 文件，在 .npmrc 文件内设置内服安装地址，参考 [解决方案二](https://blog.csdn.net/qq_35310623/article/details/129044185)
:::

## 快速上手

> 本节将介绍如何在项目中使用 library-ui

### 完整引入

```js
import Vue from 'vue'
import LibraryUI from 'library-ui'
// 引入css
import 'library-ui/dist/index.css'
Vue.use(LibraryUI)
```

完整组件列表：

```js
import { Demo } from 'library-ui'
// 引入css
import 'library-ui/dist/index.css'
Vue.use(Demo)
```