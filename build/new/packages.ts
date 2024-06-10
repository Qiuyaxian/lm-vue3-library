import fs from "fs"
import os from "os"
import path, { resolve } from "path"
import ejs from 'ejs'
import { series } from "gulp"
import glob, { sync } from "fast-glob"
import { getComponentName, getKebabCase, getUpperCamelCase, fileSave } from "../utils/index"
import { buildNewRoot, componentsRoot, lmVue3LibraryRoot } from "../utils/paths"

// 动态创建入口
const packagesIndexTemplate = fs.readFileSync(`${buildNewRoot}/template/packages/index.ejs`, 'utf8')
// 创建整个packages 组件入口
export const createPackagesIndex = async () => {
  const installComponents: Array<any> = []
  const importComponents: Array<any> = []
  // 1. 按照目录查找，生成index.ts文件引用
  const componentFiles = sync("*", {
      cwd: componentsRoot,
      // 只查找文件夹
      onlyDirectories: true
  })
  // 找到每个组件的入口文件 index.ts
  componentFiles.map((componentName: string) => {
      // 找到每个组件的入口文件 index.ts
      const componentPath = resolve(componentsRoot, componentName, "index.ts")
      // 拼接入口
      const compName = getUpperCamelCase(componentName)
      importComponents.push({
        name: getUpperCamelCase(compName),
        pkgName: componentName
      })
      installComponents.push(`${compName}`)
      return componentPath
  })
  const packagesIndexContent = ejs.render(packagesIndexTemplate, {
    importComponents: importComponents,
    installComponents: installComponents
  })
  // 输出入口
  return fileSave(`${lmVue3LibraryRoot}/index.ts`, packagesIndexContent, null)
}

export default series(createPackagesIndex)

