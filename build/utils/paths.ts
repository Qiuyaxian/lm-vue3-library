// 实现 定义 根目录 打包目录
import { resolve } from 'path'
// 根目录
export const projectRoot: string = resolve(__dirname, '../../')
// 文档目录
export const docsRoot: string = resolve(projectRoot, 'docs')
// 组件库目录
export const packagesRoot: string = resolve(projectRoot, 'packages')
// 组件目录
export const componentsRoot: string = resolve(packagesRoot, 'components')
// 工具目录
export const utilsRoot: string = resolve(packagesRoot, 'utils')
// 组件入口
export const lmVue3LibraryRoot: string = resolve(packagesRoot, 'lm-vue3-library')
// 样式目录
export const themeChalkRoot: string = resolve(packagesRoot, 'theme-chalk')
// 打包配置文件目录
export const buildRoot: string = resolve(projectRoot, 'build')
/** 创建子项目录 */
export const buildNewRoot: string = resolve(buildRoot, 'new')
/** 打包输出目录 */
export const buildOutRoot: string = resolve(projectRoot, 'dist')

