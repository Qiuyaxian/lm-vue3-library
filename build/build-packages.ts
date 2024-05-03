/**
 * 安装依赖 pnpm install rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-typescript2 rollup-plugin-vue -D -w
 */
import path, { resolve } from "path"
import { parallel } from "gulp"
import { rollup, OutputOptions } from "rollup"
import glob, { sync } from "fast-glob" // 同步查找文件
import { Project, SourceFile, ScriptTarget, ModuleKind } from "ts-morph"
import { mkdir, readFile, writeFile } from 'fs/promises'

import { buildOutRoot, componentsRoot, utilsRoot, packagesRoot, lmVue3LibraryRoot, projectRoot } from "./utils/paths"
import { buildPackagesOutConfig } from './utils/config'
import rollupBaseConfig from './rollup.base.config'

import fs from "fs"
import os from "os"
import { template, upperFirst, camelCase } from "lodash"
const upperCamelCase = (str) => upperFirst(camelCase(str))

const endOfLine = os.EOL
// 动态创建入口
// 创建整个packages 组件入口
export const createPackagesEntry = async () => {
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
    fs.writeFileSync(`${lmVue3LibraryRoot}/index.ts`, entryFileText)
}

// 打包整个 package 包入口
export const buildPackages = async () => {
  // rollup 打包的配置信息
  const config = {
    ...rollupBaseConfig,
    input: path.resolve(lmVue3LibraryRoot, "index.ts"), // 打包入口
  }
  // 组件库两种使用方式 import 导入组件库 在浏览器中使用script
  const buildPackagesOutConfigList = Object.values(buildPackagesOutConfig)
  const bundle = await rollup(config)
  return Promise.all(
    buildPackagesOutConfigList.map((option) => {
      bundle.write(option as OutputOptions);
    })
  );
};

// 生成index.d.ts入口
export const buildPackagesTypes = async () => {
  const project = new Project({
    // 生成.d.ts 我们需要有一个tsconfig
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: false,
      outDir: path.resolve(buildOutRoot, "types"),
      baseUrl: lmVue3LibraryRoot,
      // skipLibCheck: true,
      strict: false,
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext
    },
    tsConfigFilePath: path.resolve(projectRoot, "tsconfig.json"),
    skipFileDependencyResolution: true,
    skipAddingFilesFromTsConfig: true,
  });

  const filePaths = await glob("**/*.ts", {
    // ** 任意目录  * 任意文件
    cwd: lmVue3LibraryRoot,
    absolute: true,
    onlyFiles: true,
  });

  const sourceFiles: SourceFile[] = [];
  
  await Promise.all(
    filePaths.map(async function (file) {
      const sourceFile = project.addSourceFileAtPath(file); // 把所有的ts文件都放在一起 发射成.d.ts文件
      sourceFiles.push(sourceFile);
    })
  );
  
  const diagnostics = project.getPreEmitDiagnostics()
  // 输出解析过程当中的错误信息

  await project.emit({
    // 默认是放到内存中的
    emitOnlyDtsFiles: true,
  });

  const tasks = sourceFiles.map(async (sourceFile: any) => {
    const emitOutput = sourceFile.getEmitOutput();
    const tasks = emitOutput.getOutputFiles().map(async (outputFile: any) => {
      const filepath = outputFile.getFilePath();
      await mkdir(path.dirname(filepath), {
        recursive: true,
      });
      await writeFile(filepath, outputFile.getText().replaceAll("@lm-vue3-library", `.`), "utf8");
    });
    await Promise.all(tasks);
  });

  await Promise.all(tasks);
}
// 
export const createPackagesEntryParallel = parallel(createPackagesEntry)
// gulp适合流程控制和代码的转义  没有打包的功能
export const buildPackagesParallel = parallel(buildPackages)

export default buildPackagesParallel
