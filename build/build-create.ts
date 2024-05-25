/**
 * 安装依赖 pnpm install fast-glob -w -D
 */
import createQuestion from './new/question'
import { createNewComponent } from './new/component'
import { createNewDocs } from './new/docs'
import { createComponentStyle } from './new/style'
import { createPackagesIndex } from './new/packages'

const createInstall = async () => {
  createQuestion().then((answers) => {
    const { componentName, componentChineseName } = answers
    createNewComponent(componentName).then(() => {
      createPackagesIndex()
      createComponentStyle(componentName)
      createNewDocs(componentName, componentChineseName, answers)
    }).catch((err) => {
      console.log(err)
    })
  }) 
}

createInstall()