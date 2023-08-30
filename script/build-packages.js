/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import fs from 'node:fs/promises'
import {relative} from 'node:path'
import {isHidden} from 'is-hidden'
import {reporter} from 'vfile-reporter'
import {compareFile} from 'vfile-sort'
import {read, write} from 'to-vfile'
import {pipelinePackage} from './pipeline-package.js'
import {pipelineRoot} from './pipeline-root.js'

const ancestor = new URL('../', import.meta.url)
const packagesFolder = new URL('packages/', ancestor)

/** @type {PackageJson} */
const ancestorPackage = JSON.parse(
  String(await read(new URL('package.json', ancestor)))
)

let packages = await fs.readdir(packagesFolder)

packages = packages.filter(function (d) {
  return !isHidden(d)
})

const plugins = packages.filter(function (name) {
  return name.indexOf('rehype-') === 0 && name.indexOf('rehype-preset-') !== 0
})

const results = await Promise.all(
  packages.map(function (name) {
    return pipelinePackage({
      ancestor,
      ancestorPackage,
      name,
      packageFolder: new URL(name + '/', packagesFolder),
      packagesFolder,
      plugins
    })
  })
)

const files = results.flat()

files.push(...(await pipelineRoot(ancestor, files)))

// Generate info in main readme.

// Write files.
const writable = files.filter(function (d) {
  return d.data.changed
})

await Promise.all(
  writable.map(function (file) {
    file.stored = true
    return write(file)
  })
)

// Clean paths and report.
for (const file of files) {
  file.path = relative(file.cwd, file.path)
  file.history = [file.path]
}

files.sort(compareFile)

console.error(reporter(files))
