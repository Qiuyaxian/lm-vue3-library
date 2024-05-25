import fs from "fs"
import os from "os"
import path from "path"
import ejs from 'ejs'
import { series } from "gulp"
import glob, { sync } from "fast-glob" // 同步查找文件
import { template, upperFirst, camelCase } from "lodash"

import { getComponentName, getKebabCase, getUpperCamelCase, fileSave } from "../utils/index"
import { componentsRoot, buildNewRoot } from "../utils/paths"

// 创建入口
const componentIndexTemplate = fs.readFileSync(`${buildNewRoot}/template/component/index.ejs`, 'utf8')
const componentTypesTemplate = fs.readFileSync(`${buildNewRoot}/template/component/types.ejs`, 'utf8')
const componentTemplate = fs.readFileSync(`${buildNewRoot}/template/component/component.ejs`, 'utf8')
// 
const createComponentIndex = (name, path) => {
  const componentName = getComponentName(name)
  const kebabCaseComponentName = getKebabCase(name)
  const componentIndexContent = ejs.render(componentIndexTemplate, {
    componentName: componentName,
    kebabCaseComponentName: kebabCaseComponentName
  })
  // 输出入口
  return fileSave(`${path}/index.ts`, componentIndexContent, null)
}
// 创建类型声明
const createComponentTypes = (name, path) => {
  const componentName = getComponentName(name)
  const kebabCaseComponentName = getKebabCase(name)
  const componentTypesContent = ejs.render(componentTypesTemplate, {
    componentName: componentName,
    kebabCaseComponentName: kebabCaseComponentName
  })
  // 输出入口
  return fileSave(`${path}/src/${componentName}.ts`, componentTypesContent, null)
}
// 创建组建
const createComponentTemplate = (name, path) => {
  const componentName = getComponentName(name)
  const kebabCaseComponentName = getKebabCase(name)
  const componentTemplateContent = ejs.render(componentTemplate, {
    componentName: componentName,
    kebabCaseComponentName: kebabCaseComponentName
  })
  // 输出入口
  return fileSave(`${path}/src/index.vue`, componentTemplateContent, null)
}

export const createNewComponent = async (name) => {
  const kebabCaseComponentName = getKebabCase(name)
  const componentPath = path.join(componentsRoot, kebabCaseComponentName)
  return Promise.all([
    createComponentIndex(name, componentPath),
    createComponentTypes(name, componentPath),
    createComponentTemplate(name, componentPath)
  ])
}
// 获取组建
export const getComponent = (name) => {
  // 获取packages components底下所有组件
  const componentFiles: Array<string> = sync('*', {
    cwd: componentsRoot,
    onlyDirectories: true, // 只查找文件夹
  })
  const componentsMap = {}
  const componentBuilds = componentFiles.map(async (file: string) => {
    // 找到每个组件的入口文件 index.ts
    const componentInput = path.join(componentsRoot, file, "index.ts");
    componentsMap[file] = componentInput
  })
  return componentsMap[name]
}

export default series(createNewComponent)
