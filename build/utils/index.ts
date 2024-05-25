/**
 * 子进程
 * child_process.spawn(command[, args][, options])
 * command <string> 要运行的命令。
 * args <string[]> 字符串参数列表。
 * options <Object>
 *  - cwd <string> | <URL> 子进程的当前工作目录
 *  - stdio <Array> | <string> 子进程的标准输入输出配置。'inherit'：通过相应的标准输入输出流传入/传出父进程
 * - shell <boolean> | <string> 如果是 true，则在 shell 内运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用    process.env.ComSpec。 可以将不同的 shell 指定为字符串。 请参阅 shell 的要求和默认的 Windows shell。 默认值: false （没有 shell）x
 */
import { spawn } from "child_process"
import nodeFileSave from "file-save"

import { upperFirst, camelCase, kebabCase } from "lodash"
import { projectRoot } from "./paths"

// 自定义每个 task(任务) 的 name，并返还一个可执行函数
export const withTaskName = <T>(name: string, fn: T) => {
  const handle: any = Object.assign((fn as any), { displayName: name })
  return handle
}

// 在node中开启一个子进程来运行脚本
export const run = async (command: string) => {
  return new Promise((resolve) => {
    // 将命令分割 例如：rm -rf 分割为['rm', '-rf'],进行解构[cmd,...args]
    const [cmd, ...args] = command.split(" ")
    const app = spawn(cmd, args, {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: true  // 默认情况下 linux才支持 rm -rf  windows安装git bash
    })
    // 在进程已结束并且子进程的标准输入输出流已关闭之后，则触发 'close' 事件
    app.on('close', resolve)
  })
}

// 重写打包后路径
export const pathResetWriter = (format: string) => {
  return (id: string) => {
    id = (id as any).replaceAll("@lm-vue3-library", `lm-vue3-library/`)
    return id
  }
}

export const fileSave = (path, content, callback) => {
  nodeFileSave(path).write(content, 'utf8').end('\n').finish(() => {
    callback && callback()
  })
}

export const getKebabCase = (str: string) => kebabCase(str)

export const getUpperCamelCase = (str: string) => upperFirst(camelCase(str))

export const getComponentName = (componentName: string) => getUpperCamelCase(componentName)