import { resolve } from 'node:path'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import { PluginPure as pure } from 'rollup-plugin-pure'
import fg from 'fast-glob'
import { packages } from './meta/packages'

import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import type { OutputOptions, RollupOptions } from 'rollup'

const configs: RollupOptions[] = []

const pluginEsbuild = esbuild()
const pluginDts = dts()
const pluginPure = pure({
  functions: ['defineComponent'],
})

const externals = [
  '@rcuse/shared',
  '@rcuse/core',
]

function esbuildMinifer(options: ESBuildOptions) {
  const { renderChunk } = esbuild(options)

  return {
    name: 'esbuild-minifer',
    renderChunk,
  }
}

for (const pkg of packages) {
  const {
    globals,
    name,
    external,
    iife,
    cjs,
    mjs,
    submodules,
    dts,
    target = 'es2018'
  } = pkg;

  const iifeGlobals = {
    '@rcuse/shared': 'RcUse',
    '@rcuse/core': 'RcUse',
    ...(globals || {}),
  }

  const iifeName = 'RcUse'
  const functionNames = ['index']

  if (submodules)
    functionNames.push(...fg.sync('*/index.ts', { cwd: resolve(`packages/${name}`) }).map(i => i.split('/')[0]))

  for (const fn of functionNames) {
    const input = fn === 'index'
      ? `packages/${name}/index.ts`
      : `packages/${name}/${fn}/index.ts`

    const output: OutputOptions[] = []

    if (mjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.mjs`,
        format: 'es',
      })
    }

    if (cjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.cjs`,
        format: 'cjs',
      })
    }

    if (iife !== false) {
      output.push(
        {
          file: `packages/${name}/dist/${fn}.iife.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [],
        },
        {
          file: `packages/${name}/dist/${fn}.iife.min.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [
            esbuildMinifer({
              minify: true,
            }),
          ],
        },
      )
    }

    configs.push({
      input,
      output,
      plugins: [
        target
          ? esbuild({ target })
          : pluginEsbuild,
        json(),
        pluginPure,
      ],
      external: [
        ...externals,
        ...(external || []),
      ],
    })

    if (dts !== false) {
      configs.push({
        input,
        output: [
          { file: `packages/${name}/dist/${fn}.d.cts` },
          { file: `packages/${name}/dist/${fn}.d.mts` },
          { file: `packages/${name}/dist/${fn}.d.ts` }, // for node10 compatibility
        ],
        plugins: [
          pluginDts,
        ],
        external: [
          ...externals,
          ...(external || []),
        ],
      })
    }
  }
}

export default configs;
