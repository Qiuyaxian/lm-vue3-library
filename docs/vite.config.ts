import { defineConfig } from 'vite'
import { resolve } from "path"; // 导入 path 模块，帮助我们解析路径
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    // vue(),
    vueJsx(),
  ],
  resolve: { // 这里配置需要注意：Vite新版本resolve配置改为对象形式，如下：
    alias: [
      {
        find: '@lm-vue3-library',
        replacement: resolve(__dirname, "../packages"),
      }
    ],
  }
})
