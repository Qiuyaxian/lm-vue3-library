import { defineConfig } from 'vitepress'
import MarkdownIt from 'markdown-it'
import { name, version } from '../../package.json'
// https://vitepress.dev/reference/site-config
import docsConfig from '../docs.json'
import docsDemo from './markdown/plugin/docs-demo'
export default defineConfig({
  title: `${name}(v${version})`,
  description: "基于 rollup + esbuild 打包器实现的 vue3 内部组件库",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' }
    ],

    // sidebar: [
    //   {
    //     text: '组件(Components)',
    //     items: [
    //       { text: '按钮(Button)', link: '/components/button/index.md' }
    //     ]
    //   }
    // ],
    sidebar: docsConfig
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },
  markdown: {
    lineNumbers: true,
    config: (md: MarkdownIt) => {
      // md.use(markdownItCheckbox);
      md.use(docsDemo);
    },
  }
})
