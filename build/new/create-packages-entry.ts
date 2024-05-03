import fs from "fs"
import os from "os"
import { resolve } from "path"
import { sync } from "fast-glob" // 同步查找文件
import { series } from "gulp"
import { template, upperFirst, camelCase } from "lodash"
const upperCamelCase = (str) => upperFirst(camelCase(str))
import { packagesRoot, componentsRoot } from "./utils/paths"

const endOfLine = os.EOL

// 创建组件入口
const createComponentEntry = async () => {
    const COMPONENT_IMPORT_TEMPLATE = "export * from '@packages/<%= pkgName %>'"

    const MAIN_IMPORT_TEMPLATE = `
    <%= importText %>
    `

    const allImportComponents: Array<any> = []

    const componentImportCompiled = template(MAIN_IMPORT_TEMPLATE)

    const componentTplCompiled = template(COMPONENT_IMPORT_TEMPLATE)
    // 1. 按照目录查找，生成index.ts文件引用
    const componentFiles = sync("*", {
        cwd: packagesRoot,
        // 只查找文件夹
        onlyDirectories: true
    })
    // 找到每个组件的入口文件 index.ts
    const componentList: Array<string> = componentFiles.map((componentName: string) => {
        // 找到每个组件的入口文件 index.ts
        const componentPath = resolve(packagesRoot, componentName, "index.ts")
        // 拼接入口
        allImportComponents.push(
        componentTplCompiled({
            pkgName: componentName
        })
        )
        return componentPath
    })
    const entryFileText = componentImportCompiled({
        importText: allImportComponents.join(endOfLine)
    })
    // 输出入口
    fs.writeFileSync(`${packagesRoot}/index.ts`, entryFileText)
    return componentList
}

// 创建整个packages 组件入口
const createPackagesEntry = async () => {
    const COMPONENT_IMPORT_TEMPLATE = `import <%= name %> from '@lm-vue3-library/components/<%= pkgName %>/index';`
    const MAIN_IMPORT_TEMPLATE = `
<%= importText %>
const components = [
    <%= installText %>
];
const install = function(app) {
    components.forEach((component) => {
        app.use(component)
    })
};
/* istanbul ignore if */
export {
// components
   <%= exportText %>
};
export default {
   install
};`
    const allImportComponents: Array<any> = []
    const allInstallComponents: Array<any> = []
    const componentImportCompiled = template(MAIN_IMPORT_TEMPLATE)

    const componentTplCompiled = template(COMPONENT_IMPORT_TEMPLATE)
    // 1. 按照目录查找，生成index.ts文件引用
    const componentFiles = sync("*", {
        cwd: componentsRoot,
        // 只查找文件夹
        onlyDirectories: true
    })
    // 找到每个组件的入口文件 index.ts
    const componentList: Array<string> = componentFiles.map((componentName: string) => {
        // 找到每个组件的入口文件 index.ts
        const componentPath = resolve(componentsRoot, componentName, "index.ts")
        // 拼接入口
        const compName = upperCamelCase(componentName)
        allImportComponents.push(
            componentTplCompiled({
                name: upperCamelCase(compName),
                pkgName: componentName
            })
        )
        allInstallComponents.push(`${compName}`)
        return componentPath
    })
    const entryFileText = componentImportCompiled({
        importText: allImportComponents.join(endOfLine),
        installText: allInstallComponents.join(',' + endOfLine),
        exportText: allInstallComponents.join(',' + endOfLine)
    })
    // 输出入口
    fs.writeFileSync(`${packagesRoot}/lm-vue3-library/index.ts`, entryFileText)
}
export const buildComponentEntry = series(createPackagesEntry)

export default buildComponentEntry