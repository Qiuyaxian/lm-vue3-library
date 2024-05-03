import { defineConfig } from 'vitepress'
import { name, version } from '../../package.json'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: `${name}(v${version})`,
  description: "基于rollup + esbuild打包器实现的 vue3 内部组件库",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: '组建(Components)',
        items: [
          { text: '按钮(Button)', link: '/components/button/index.md' }
        ]
      }
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})
