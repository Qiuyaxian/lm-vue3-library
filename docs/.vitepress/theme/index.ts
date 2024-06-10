import DefaultTheme from "vitepress/theme";
import DocsDemo from '../components/docs-demo/index.vue'
import lmVue3Library from 'lm-vue3-library';
import '@lm-vue3-library/theme-chalk/src/index.less';

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app }) => {
    app.component('DocsDemo', DocsDemo);
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.use(lmVue3Library);
  },
};