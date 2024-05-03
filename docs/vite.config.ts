import { defineConfig } from 'vite'
import { resolve } from "path"; // 导入 path 模块，帮助我们解析路径

export default defineConfig({
  resolve: { // 这里配置需要注意：Vite新版本resolve配置改为对象形式，如下：
    alias: [
      {
        find: '@lm-vue3-library',
        replacement: resolve(__dirname, "../packages"),
      }
    ],
  }
})
