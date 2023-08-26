/**
 * @typedef {import('trough').Callback} Next
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import fs from 'node:fs'
import path from 'node:path'
import {read} from 'to-vfile'
import {trough} from 'trough'

const filePipeline = trough()
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files: Array<string>, tests: boolean, file?: VFile}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      read(path.join(ctx.root, 'index.js'), (error, file) => {
        if (file) {
          ctx.file = file
        }

        next(error)
      })
    }
  )
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files: Array<string>, tests: boolean, file: VFile}} ctx
     */
    (ctx) => {
      const doc = String(ctx.file)
      let index = -1

      while (++index < ctx.plugins.length) {
        const name = ctx.plugins[index]
        /** @type {PackageJson} */
        const pack = JSON.parse(
          String(
            fs.readFileSync(
              path.join(ctx.ancestor, 'packages', name, 'package.json')
            )
          )
        )
        const re = new RegExp('\\b' + name.slice('rehype-'.length) + '\\b')
        /** @type {boolean|undefined} */
        // @ts-expect-error: Custom field in plugins.
        const exclude = pack.excludeFromPreset

        if (re.test(doc)) {
          if (exclude) {
            throw new Error(
              'Did not expect `' + name + '` in `' + ctx.root + '`'
            )
          }
        } else if (!exclude) {
          throw new Error('Expected `' + name + '` in `' + ctx.root + '`')
        }
      }
    }
  )

export const pipelinePresets = trough().use(
  /**
   * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files: Array<string>, tests: boolean, file?: VFile}} ctx
   * @param {Next} next
   */
  (ctx, next) => {
    filePipeline.run(
      ctx,
      /**
       * @param {Error} error
       */
      (error) => {
        next(error)
      }
    )
  }
)
