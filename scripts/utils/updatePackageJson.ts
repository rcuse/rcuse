import { join } from 'node:path'
import fs from 'fs-extra'
import { packages } from '../../meta/packages'
import { PATHS } from '../.internal/constants'

export async function updatePackageJSON() {
  const { version } = await fs.readJSON('package.json')

  for (const { name, description, author, iife } of packages) {
    const packageDir = join(PATHS.PACKAGES, name)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.description = description || packageJSON.description
    packageJSON.author = author || 'wangxingkang <https://github.com/wangxingkang>'
    packageJSON.bugs = {
      url: 'https://github.com/rcuse/rcuse/issues',
    }
    packageJSON.homepage = name === 'core'
      ? 'https://github.com/rcuse/rcuse#readme'
      : `https://github.com/rcuse/rcuse/tree/main/packages/${name}#readme`
    packageJSON.repository = {
      type: 'git',
      url: 'git+https://github.com/rcuse/rcuse.git',
      directory: `packages/${name}`,
    }
    packageJSON.main = './index.cjs'
    packageJSON.types = './index.d.cts'
    packageJSON.module = './index.mjs'
    if (iife !== false) {
      packageJSON.unpkg = './index.iife.min.js'
      packageJSON.jsdelivr = './index.iife.min.js'
    }
    packageJSON.exports = {
      '.': {
        import: './index.mjs',
        require: './index.cjs',
      },
      './*': './*',
      ...packageJSON.exports,
    }

    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
  }
}
