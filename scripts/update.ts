import fs from 'fs-extra'
import { updatePackageJSON } from './utils'

(async function run() {
  await Promise.all([
    updatePackageJSON(),
  ])
})()
