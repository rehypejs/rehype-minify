/**
 * @typedef {import('trough').Callback} Next
 * @typedef {import('vfile').VFile} VFile
 *
 * @typedef Context
 * @property {string} root
 * @property {string} [ancestor]
 * @property {string[]} [plugins]
 */

import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import {bail} from 'bail'
import {trough} from 'trough'
import {isHidden} from 'is-hidden'
import {pipelineRoot} from './pipeline-root.js'
import {pipelinePackage} from './pipeline-package.js'
import {pipelineReadme} from './pipeline-readme.js'
import {pipelinePresets} from './pipeline-presets.js'

const rootPath = process.cwd()
const packages = path.join(rootPath, 'packages')

fs.readdir(packages, (error, basenames) => {
  bail(error)

  basenames = basenames.filter((d) => !isHidden(d))

  const plugins = basenames.filter(
    (name) =>
      name.indexOf('rehype-') === 0 && name.indexOf('rehype-preset-') !== 0
  )

  // Generate all packages.
  let index = -1

  while (++index < basenames.length) {
    const basename = basenames[index]

    trough()
      .use(
        /**
         * @param {Context} ctx
         * @param {Next} next
         */
        (ctx, next) => {
          pipelinePackage.run(ctx, next)
        }
      )
      .use(
        /**
         * @param {Context} ctx
         * @param {Next} next
         */
        (ctx, next) => {
          if (basename.indexOf('rehype-preset-') === 0) {
            pipelinePresets.run(ctx, next)
          } else {
            pipelineReadme.run(ctx, next)
          }
        }
      )
      .run(
        {ancestor: rootPath, root: path.join(packages, basename), plugins},
        wrap(basename)
      )
  }

  // Generate root `readme.md`.
  pipelineRoot.run({root: rootPath, plugins}, wrap(path.basename(rootPath)))

  /**
   * @param {string} basename
   */
  function wrap(basename) {
    return done

    /**
     * @param {Error?} error
     * @param {Record<string, VFile>} ctx
     */
    function done(error, ctx) {
      /** @type {string} */
      let key

      if (error) {
        console.error(chalk.red('✗ ') + basename)
        error.message = 'Could not process `' + basename + '`: ' + error.message
        throw error
      }

      console.log(chalk.green('✓ ') + basename)

      for (key in ctx) {
        if (ctx[key] && ctx[key].stored) {
          console.log('  └─ ' + ctx[key].basename)
        }
      }
    }
  }
})
