/**
 * 安装依赖 pnpm install fast-glob -w -D
 */
import { series } from "gulp"
import path, { resolve } from "path"
import glob, { sync } from "fast-glob" // 同步查找文件
import { mkdir, readFile, writeFile } from 'fs/promises'
import { rollup, OutputOptions, RollupOptions } from "rollup"
import { Project, SourceFile, ScriptTarget, ModuleKind } from "ts-morph"

import rollupBaseConfig from './rollup.base.config'
import { buildConfig } from "./utils/config"
import { buildOutRoot, utilsRoot, projectRoot } from "./utils/paths"

export const buildUtils = async () => {
  // 1. 按照目录查找，生成index.ts文件引用
  const utilsFiles: Array<string> = sync('**/*.ts', {
    cwd: utilsRoot,
    absolute: true,
    onlyFiles: true
  })
  const utilsBuilds = utilsFiles.map(async (file: string) => {
    // 找到每个入口文件 index.ts
    const fileName = path.basename(file, '.ts')
    const config: RollupOptions = {
      ...rollupBaseConfig,
      input: file,
      treeshake: false,
    }
    const bundle = await rollup(config);
    const configOptions = Object.values(buildConfig).map((config) => {
      return {
        format: config.format as any,
        file: path.resolve(config.output.path, `utils/${fileName}.${config.format}.js`),
        exports: "named",
      }
    })
    await Promise.all(
      configOptions.map((option) => bundle.write(option as OutputOptions))
    );
  })
  return Promise.all(utilsBuilds)
}

// utils => index.d.ts
export const buildUtilsTypes = async () => {
  const project = new Project({
    // 生成.d.ts 我们需要有一个tsconfig
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: false,
      outDir: path.resolve(buildOutRoot, "types/utils"),
      baseUrl: utilsRoot,
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
    cwd: utilsRoot,
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
      await writeFile(filepath, outputFile.getText(), "utf8");
    });
    await Promise.all(tasks);
  });

  await Promise.all(tasks);
}

export const buildUtilsSeries = series(buildUtils)

export default buildUtilsSeries