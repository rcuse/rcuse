import path from 'node:path'
import assert from 'node:assert'
import { execSync as exec } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { consola } from 'consola'
import YAML from 'yaml'
import { packages } from '../meta/packages'
import { version } from '../package.json'
import { PATHS } from './.internal/constants'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const watch = process.argv.includes('--watch')

const FILES_COPY_ROOT = [
  'LICENSE',
]

const FILES_COPY_LOCAL = [
  'README.md',
  'index.json',
  '*.cjs',
  '*.mjs',
  '*.d.ts',
  '*.d.cts',
  '*.d.mts',
]

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
  const workspaceData = YAML.parse(await fs.readFile(path.resolve(PATHS.ROOT, 'pnpm-workspace.yaml'), 'utf-8'))

  for (const { name } of packages) {
    const packageRoot = path.resolve(PATHS.PACKAGES, name)
    const packageDist = path.resolve(packageRoot, 'dist')

    if (name === 'core')
      await fs.copyFile(path.join(PATHS.ROOT, 'README.md'), path.join(packageDist, 'README.md'))

    for (const file of FILES_COPY_ROOT)
      await fs.copyFile(path.join(PATHS.ROOT, file), path.join(packageDist, file))

    const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot })
    for (const file of files)
      await fs.copyFile(path.join(packageRoot, file), path.join(packageDist, file))

    const packageJSON = await fs.readJSON(path.join(packageRoot, 'package.json'))
    for (const [key, value] of Object.entries(packageJSON.dependencies || {})) {
      if (key.startsWith('@rcuse/')) {
        packageJSON.dependencies[key] = version
      }
      else if ((value as string).startsWith('catalog:')) {
        const resolved = workspaceData.catalog[key as string]
        if (!resolved)
          throw new Error(`Cannot resolve catalog entry for ${key}`)
        packageJSON.dependencies[key] = resolved
      }
    }
    await fs.writeJSON(path.join(packageDist, 'package.json'), packageJSON, { spaces: 2 })
  }
}

async function build() {
  consola.info('Clean up')
  exec('pnpm run clean', { stdio: 'inherit' })

  consola.info('Rollup')
  exec(`pnpm run build:rollup${watch ? ' -- --watch' : ''}`, { stdio: 'inherit' })

  await buildMetaFiles()
}

export {
  build,
}
