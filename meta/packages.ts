import type { PackageManifest } from '@rcuse/metadata'

export const packages: PackageManifest[] = [
  {
    name: 'metadata',
    display: 'Metadata for RcUse functions',
    manualImport: true,
    iife: false,
    utils: true,
    target: 'node14',
  },
  {
    name: 'shared',
    display: 'Shared utilities',
  },
  {
    name: 'core',
    display: 'RcUse',
    description: 'Collection of essential React Composition Utilities',
  },
  {
    name: 'integrations',
    display: 'Integrations',
    description: 'Integration wrappers for utility libraries',
    addon: true,
    submodules: true,
    external: [
      'nprogress',
    ],
    globals: {
      'nprogress': 'nprogress',
    },
  },
]
