# pnpm-monorepo-vite

这是使用 [pnpm] 的 `monorepo` 进行管理 vite 项目

每个包（`packages/**`）都有自己的自述文件，说明特定的包如何工作或被使用

## 工作空间
[pnpm] 内置了对单一存储库（也称为多包存储库、多项目存储库或单体存储库）的支持，可以创建一个 workspace 以将多个项目合并到一个仓库中。

[pnpm-workspace.yaml] 定义了工作空间的根目录，并能够使您从工作空间中包含或排除目录。默认情况下，包含所有子目录。本项目的子项目的目录为 `packages/**`
## 运行
安装 [pnpm]（本项目只允许使用`pnpm`为包管理工具，请使用`pnpm`替代`npm`）
- `npm i -g pnpm`

然后执行
- `pnpm install`

之后，在根目录的`package.json`查看可用命令
- `pnpm eslint`: 格式化代码
- `pnpm cm`：可视化提交代码
- `pnpm release`: 修改版本号
- `pnpm <package_name>:dev`: 本地运行指定的子项目
- `pnpm <package_name>:build`: 为指定的子项目构建生产环境包
- `pnpm <package_name>:build:staging`: 为指定的子项目构建构建预生产（测试）环境包

## 项目目录
```
|- packages               工作空间（子项目存放目录）
    |- viewui             基于view-design的自定义ui组件库
|- .npmrc                 包管理器配置
|- .cz-config.js          可视化提交配置
|- .eslintignore.js       代码格式忽略文件声明
|- .eslintrc.js           代码格式规则
|- .gitignore.js          git提交忽略文件声明
|- .versionrc.js          版本控制配置
|- CHANGELOG.md           版本日志详情
|- commitlint.config.js   提交代码规范设置
|- package.json           依赖配置文件
|- pnpm-workspace.yaml    工作空间配置文件
|- pnpm-lock.yaml         依赖版本锁定
```

## pnpm 的使用
**注意: 所有的pnpm命令均在根目录执行，如无必要无需进入子项目目录**

### 常用命令
|  pnpm   | npm  |
|  ----  | ----  |
| `pnpm install`  | `npm install` |
| `pnpm add <pkg>`  | `npm install <pkg>` |
| `pnpm remove <pkg>`  | `npm uninstall <pkg>` |
| `pnpm <script>`  | `npm run <script>` |

### [管理依赖]
`pnpm add <pkg>`
* `--save-prod`, `-P`: （默认）安装为常规的 `dependencies`
* `--save-dev`, `-D`: 安装为 `devDependencies`
* `--ignore-workspace-root-check`, `-w`: 在根目录添加依赖项时需使用此标记
* `--workspace`: 添加在 workspace 找到的依赖项（子项目互相引用时使用）
* `--filter <package_selector>`: 在指定的子项目中安装依赖

**示例：**
`pnpm add vite -Dw`: 在根目录中安装vite，并将其安装为devDependencies，vite将在所有子项目中都可以被使用
`pnpm add xxx --filter xx`: 为子项目xxx安装xxx
`pnpm add xx --workspace -w`: 在根目录下装子包xxx

`pnpm remove <pkg>`命令同理

## 建议
1. 子项目使用作用域包名，以防止名称冲突，如项目名称为 `monorepo` ， 子项目名称为 `xxx`, 则子项目的 `package.json` 中的 `name` 值为 `@monorepo/xxx`
2. 在根目录的 `package.json` 中添加各子项目的运行脚本，以方便在根目录的终端中使用

[pnpm]: https://pnpm.io/zh/
[pnpm-workspace.yaml]: https://pnpm.io/zh/pnpm-workspace_yaml
[依赖安装]: https://pnpm.io/zh/cli/add
