import fs from "fs"
import os from "os"
import path from "path"
import ejs from 'ejs'
import { series } from "gulp"
import glob, { sync } from "fast-glob" // 同步查找文件
import { template, upperFirst, camelCase } from "lodash"

import { getComponentName, getKebabCase, getUpperCamelCase, fileSave } from "../utils/index"
import { buildNewRoot, themeChalkRoot } from "../utils/paths"

// 创建入口
const componentStyleTemplate = fs.readFileSync(`${buildNewRoot}/template/style/css.ejs`, 'utf8')

export const createComponentStyle = (name) => {
  const componentName = getComponentName(name)
  const kebabCaseComponentName = getKebabCase(name)
  const componentStyleContent = ejs.render(componentStyleTemplate, {
    componentName: componentName,
    kebabCaseComponentName: kebabCaseComponentName
  })
  // 输出入口
  return fileSave(`${themeChalkRoot}/src/${kebabCaseComponentName}.less`, componentStyleContent, null)
}

export default series(createComponentStyle)
