import { series } from "gulp"
import { buildUtilsTypes } from './build-utils'
import { buildPackagesTypes } from './build-packages'
import { buildComponentsTypes } from './build-components'

export const buildTypes = series(buildUtilsTypes, buildPackagesTypes, buildComponentsTypes);

export default buildTypes
