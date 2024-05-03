import { series, src, dest } from 'gulp'
import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import { themeChalkRoot, buildOutRoot } from "./utils/paths"

// 清空文件夹
export const clearThemeChalk = async () => {
  
}

// 编译less文件
export const buildThemeChalk = async () => {
  return src(`${themeChalkRoot}/src/*.less`)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(dest(`${buildOutRoot}/theme-chalk`))
}

// 打包后复制代码
export const buildThemeChalkCopy = async () => {
  return src(`${themeChalkRoot}/fonts/**`).pipe(dest(`${buildOutRoot}/theme-chalk/fonts`))
}

// 将构建后的index.css 复制到 dist下
export const buildThemeChalkSeries = series(buildThemeChalk, buildThemeChalkCopy)

export default buildThemeChalkSeries