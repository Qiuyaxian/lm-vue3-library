/*
 * 打包方式：串行(series)  并行(parallel)
*/
import { series, parallel } from 'gulp';
import { withTaskName, run } from './utils';

export * from './build-packages';
export * from './build-components';
export * from './build-utils';
export * from './build-theme-chalk';
export * from './build-types';
/**
 * 1. 打包样式
 * 2. 打包工具方法
 * 3. 打包所有组件
 * 4. 打包每个组件
 * 5. 生成一个组件库
 * 6. 发布组件
 * https://books.sangniao.com/manual/1383487790/93676042
 * pnpm run --parallel
 * 完全忽略并发和拓扑排序，在所有匹配的包中立即运行给定的脚本 并输出前缀流。 这是个推荐的标志，用于在许多 packages上长时间运行的进程，例如冗长的构建进程。
 */
export default series(
  // 删除dist目录
  withTaskName('clean', async () => run('rimraf ./dist')),
  // 生成入口文件
  withTaskName('createEntry', () => run('npm run build createPackagesEntryParallel')),
  parallel(
    // 打包umd,commonjs
    withTaskName("buildPackagesParallel", () => run("npm run build buildPackagesParallel")),
    // 打包按需加载
    withTaskName('buildComponentsSeries', () => run('npm run build buildComponentsSeries')),
    // 打包工具方法
    withTaskName('buildUtilsSeries', () => run('npm run build buildUtilsSeries')),
    // 打包样式
    withTaskName('buildThemeChalkSeries', () => run('npm run build buildThemeChalkSeries')),
  ),
  parallel(withTaskName('buildTypes', () => run('npm run build buildTypes')))
)
