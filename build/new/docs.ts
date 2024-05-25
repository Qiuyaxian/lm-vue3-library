import fs from "fs"
import os from "os"
import path from "path"
import ejs from 'ejs'
import { series } from "gulp"
import glob, { sync } from "fast-glob" // 同步查找文件

import { getComponentName, getKebabCase, getUpperCamelCase, fileSave } from "../utils/index"
import { docsRoot, buildNewRoot } from "../utils/paths"
const docsConfigPath = path.join(docsRoot, './docs.json')
// 创建组建
const componentIndexTemplate = fs.readFileSync(`${buildNewRoot}/template/docs/md.ejs`, 'utf8')
const componentDemoTemplate = fs.readFileSync(`${buildNewRoot}/template/docs/demo.ejs`, 'utf8')

export const createDocsTemplate = (name, path) => {
  const componentName = getComponentName(name)
  const kebabCaseComponentName = getKebabCase(name)
  const componentIndexContent = ejs.render(componentIndexTemplate, {
    componentName: componentName,
    kebabCaseComponentName: kebabCaseComponentName
  })
  // 输出入口
  return fileSave(`${path}/index.md`, componentIndexContent, null)
}

export const createDemoTemplate = (name, path) => {
  const componentName = getComponentName(name)
  const kebabCaseComponentName = getKebabCase(name)
  const componentDemoContent = ejs.render(componentDemoTemplate, {
    componentName: componentName,
    kebabCaseComponentName: kebabCaseComponentName
  })
  // 输出入口
  return fileSave(`${path}/demo/index.vue`, componentDemoContent, null)
}

export const createNewDocs = async (name, chineseName, opt) => {
  const { componentType, componentChineseName, newComponentType, chineseComponentType } = opt
  const kebabCaseComponentName = getKebabCase(name)
  let docPath = path.join(docsRoot, `./${componentType}/${kebabCaseComponentName}`)
  let demoPath = path.join(docsRoot, `./${componentType}/${kebabCaseComponentName}`)

  let docsConfigs = []
  if (fs.existsSync(docsConfigPath)) {
    docsConfigs = JSON.parse(fs.readFileSync(docsConfigPath, 'utf-8'))
  }
  // 新增归类类型
  const docsType = `${chineseComponentType}(${newComponentType})`
  const componentText = `${chineseName}(${kebabCaseComponentName})`
  if (componentType === -1) {
    docPath = path.join(docsRoot, `./${newComponentType}/${kebabCaseComponentName}`)
    // 重新生成文档路径
    docsConfigs.push({
      title: chineseComponentType,
      name: newComponentType,
      text: docsType,
      collapsable: false,
      items: [
        {
          link: `/${newComponentType}/${kebabCaseComponentName}`,
          text: componentText
        }
      ]
    })
  } else {
    const SHORT_MD_PATH = `/${componentType}/${kebabCaseComponentName}`
    let currentComponentType = docsConfigs.find((item) => item.name === componentType)
    console.log(currentComponentType, 'currentComponentType')
    if (!currentComponentType) {
      currentComponentType = {
        title: chineseComponentType,
        name: newComponentType,
        text: docsType,
        collapsable: false,
        items: [
          {
            link: `/${newComponentType}/${kebabCaseComponentName}`,
            text: componentText
          }
        ]
      }
    }
    if (!currentComponentType.items) {
      currentComponentType.items = []
    }
    const componentDocsItem = currentComponentType.items.find((item) => item.link === SHORT_MD_PATH)
    console.log(componentDocsItem, 'componentDocsItem')
    if (!componentDocsItem) {
      currentComponentType.items.push({
        link:SHORT_MD_PATH,
        text: componentText
      })
    }
  }
  console.log(docsConfigs, 'docsConfigPath')
  createDocsTemplate(name, docPath)
  createDemoTemplate(name, demoPath)
  // 保持配置
  fileSave(docsConfigPath, JSON.stringify(docsConfigs, null, 2), null)
}

export default series(createNewDocs)
