/**
 * 安装依赖 pnpm install fast-glob -w -D
 * [demo]：https://segmentfault.com/a/1190000040127796?sort=newest
 */
import { series } from "gulp"
import path, { resolve } from "path"
import glob, { sync } from "fast-glob" // 同步查找文件
import { mkdir, readFile, writeFile } from 'fs/promises'
import { rollup, OutputOptions, RollupOptions } from "rollup"
import { Project, SourceFile } from "ts-morph"
import * as VueCompiler from '@vue/compiler-sfc'

import rollupBaseConfig from './rollup.base.config'
import { buildConfig } from "./utils/config"
import { buildOutRoot, componentsRoot, packagesRoot, projectRoot } from "./utils/paths"

// 打包每个组件
export const buildComponents = async () => {
  // 打包每个组件
  // 1. 按照目录查找，生成index.ts文件引用
  const componentFiles: Array<string> = sync('*', {
    cwd: componentsRoot,
    onlyDirectories: true, // 只查找文件夹
  })
  const componentBuilds = componentFiles.map(async (file: string) => {
    // 找到每个组件的入口文件 index.ts
    const componentInput = path.resolve(componentsRoot, file, "index.ts");
    const config: RollupOptions = {
      ...rollupBaseConfig,
      input: componentInput,
      treeshake: false,
      external: (id) => {
        return /^vue/.test(id) || /^@lm-vue3-library/.test(id)
      }
    }
    const bundle = await rollup(config);
    const configOptions = Object.values(buildConfig).map((config) => {
      return {
        format: config.format as any,
        file: path.resolve(config.output.path, `components/${file}/index.${config.format}.js`),
        exports: "named",
      }
    })
    await Promise.all(
      configOptions.map((option) => bundle.write(option as OutputOptions))
    );
  })
  return Promise.all(componentBuilds)
}

/**
 * 1. 先对所有组件进行打包
 * 2. 生成组件的index.d.ts入口
 * 3. 迁移index.d.ts入口文件
 * 4. 对打包好后的组件进行入口生成
 */
export const buildComponentsTypes = async () => {
  const project = new Project({
    // 生成.d.ts 我们需要有一个tsconfig
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      outDir: path.resolve(buildOutRoot, "types"),
      baseUrl: projectRoot,
      skipLibCheck: true,
      strict: false,
      paths: {
        "@lm-vue3-library/*": ["packages/*"],
      },
    },
    tsConfigFilePath: path.resolve(projectRoot, "tsconfig.json"),
    // skipFileDependencyResolution: true,
    skipAddingFilesFromTsConfig: true,
  });
  const filePaths = await glob("**/*", {
    // ** 任意目录  * 任意文件
    cwd: componentsRoot,
    absolute: true,
    onlyFiles: true,
  });
  const sourceFiles: SourceFile[] = [];
  await Promise.all(
    filePaths.map(async function (file) {
      if (file.endsWith(".vue")) {
        const content = await readFile(file, "utf8");
        const hasTsNoCheck = content.includes('@ts-nocheck')
        const sfc = VueCompiler.parse(content);
        const { script, scriptSetup } = sfc.descriptor

        if (script || scriptSetup) {
          // let content = script.content; // 拿到脚本  icon.vue.ts  => icon.vue.d.ts
          let content = (hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '')
          if (scriptSetup) {
            // 这个 id 是 scopeId，用于，用于 css scope，保证唯一即可
            const compiled = VueCompiler.compileScript(sfc.descriptor, {
              id: `scope-id-${Date.now().toString()}`,
            })
            content += compiled.content
          }
          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(`${file}.${lang}`, content);
          sourceFiles.push(sourceFile);
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file); // 把所有的ts文件都放在一起 发射成.d.ts文件
        sourceFiles.push(sourceFile);
      }
    })
  );

  // 输出解析过程当中的错误信息
  // const diagnostics = project.getPreEmitDiagnostics()
  // console.log(project.formatDiagnosticsWithColorAndContext(diagnostics))

  await project.emit({
    // 默认是放到内存中的
    emitOnlyDtsFiles: true,
  });

  const tasks = sourceFiles.map(async (sourceFile: any, index: Number) => {
    const emitOutput = sourceFile.getEmitOutput();
    const tasks = emitOutput.getOutputFiles().map(async (outputFile: any) => {
      const filepath = outputFile.getFilePath();
      await mkdir(path.dirname(filepath), {
        recursive: true,
      });
      await writeFile(filepath, outputFile.getText().replaceAll("@lm-vue3-library", `lm-vue3-library`), "utf8");
    });
    await Promise.all(tasks);
  });
  await Promise.all(tasks);
}

export const buildComponentsSeries = series(buildComponents)

export default buildComponentsSeries