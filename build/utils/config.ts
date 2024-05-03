import { resolve } from "path"
import { camelCase } from "lodash"
import { buildOutRoot } from "./paths"
import { name } from '../../package.json'
export const packageName = camelCase(name)

export const buildConfig = {
  esm: {
    format: "esm", // 需要配置格式化化后的模块规范
    output: {
      name: "es", // 打包到dist目录下的那个目录
      path: resolve(buildOutRoot, "es"),
    }
  },
  umd: {
    module: "umd",
    format: "umd",
    // name: packageName, // 全局变量名字
    output: {
      name: "lib",
      path: resolve(buildOutRoot, "lib"),
    }
  },
}
export type BuildConfig = typeof buildConfig

export const buildPackagesOutConfig = {
  esm: {
    format: "esm",
    file: resolve(buildOutRoot, "index.esm.js"),
  },
  umd: {
    file: resolve(buildOutRoot, "index.umd.js"),
    format: "umd", // 打包的格式
    name: packageName, // 全局变量名字
    exports: "named", // 导出的名字 用命名的方式导出 libaryTarget:"" name:""
    globals: {
      // 表示使用的vue是全局的
      vue: "Vue",
    },
  },
}
export type BuildPackagesOutConfig = typeof buildPackagesOutConfig
