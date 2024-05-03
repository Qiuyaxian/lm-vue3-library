import path from "path"
import alias from '@rollup/plugin-alias'
import vue from "rollup-plugin-vue"
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs" // 将 CommonJS 模块转换为 ES6
import esbuild from 'rollup-plugin-esbuild'
import url from '@rollup/plugin-url'
import { nodeResolve } from "@rollup/plugin-node-resolve" // 处理文件路径
// import { rollup, OutputOptions } from "rollup"
// import viteVue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import DefineOptions from 'unplugin-vue-define-options/rollup'

export default {
  plugins: [
      alias({
        entries: [
          {
            find: '@lm-vue3-library',
            replacement: path.resolve(__dirname, '../packages')
          }
        ]
      }),
      nodeResolve({
        extensions: ['.ts', '.tsx', '.vue']
      }),
      // typescript(),
      vue(),
      // 处理通过img标签引入的图片
      url({
        fileName: '[dirname][hash][extname]',
        include: ["**/*.jpg", "**/*.png", "**/*.svg"],
        // 输出路径
        // dest: "dist/assets",
        // 超过10kb则拷贝否则转base64
        limit: 10 * 1024 // 10KB
      }),
      commonjs(),
      esbuild({
          sourceMap: false,
          exclude: /node_modules/,
          target: "es2018"
      })
  ],
  external: ['vue'], // 打包的时候不打包vue代码
}