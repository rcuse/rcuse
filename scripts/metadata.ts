import { join } from 'node:path'
import fg from 'fast-glob'
import { simpleGit } from 'simple-git'
import { PATHS } from './.internal/constants'

import { packages } from '../meta/packages'
import { ecosystemFunctions } from '../meta/ecosystem-functions'

import type { PackageIndexes } from '@rcuse/metadata'

const git = simpleGit(PATHS.ROOT);

export async function listFunctions(dir: string, ignore: string[] = []) {
  const files = await fg('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignore,
    ],
  })
  files.sort()
  return files
}

export async function readMetadata() {
  const indexes: PackageIndexes = {
    packages: {},
    categories: [],
    functions: [
      ...ecosystemFunctions,
    ],
  }

  for (const info of packages) {
    if (info.utils) continue

    const dir = join(PATHS.PACKAGES, info.name)

    const functions = await listFunctions(dir)

    console.log(functions);
  }
}

(async () => {
  const indexes = await readMetadata()
})();
