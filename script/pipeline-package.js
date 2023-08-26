/**
 * @typedef {import('trough').Callback} Next
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import fs from 'node:fs'
import path from 'node:path'
import {exec} from 'node:child_process'
import {read} from 'to-vfile'
import {findDownAll} from 'vfile-find-down'
import {trough} from 'trough'

export const pipelinePackage = trough()
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package?: VFile}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      read(path.join(ctx.root, 'package.json'), (error, file) => {
        if (file) {
          ctx.package = file
        }

        next(error)
      })
    }
  )
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors?: Array<string>}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      const fp = path.relative(ctx.ancestor, ctx.root)
      const cmd = 'git log --all --format="%cN <%cE>" "' + fp + '"'

      exec(cmd, (error, stdout) => {
        if (error) return next(error)

        ctx.contributors = [...new Set(stdout.split('\n'))]
          .sort()
          .filter(Boolean)
          .filter((d) => !d.includes('<noreply'))

        if (ctx.contributors.length === 0) {
          ctx.contributors = undefined
        }

        next()
      })
    }
  )
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files?: Array<string>, tests?: boolean}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      findDownAll(['.js', '.ts'], ctx.root, (error, files) => {
        ctx.tests = false

        if (files) {
          ctx.files = files
            .map((file) => path.relative(ctx.root, file.path))
            .filter((name) => {
              if (name === 'package.json' || /example/.test(name)) {
                return false
              }

              if (/test/.test(name)) {
                ctx.tests = true
                return false
              }

              return true
            })
            .sort()
        }

        next(error)
      })
    }
  )
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files?: Array<string>, tests?: boolean}} ctx
     */
    (ctx) => {
      /** @type {PackageJson} */
      const previous = JSON.parse(String(ctx.package))
      /** @type {PackageJson} */
      const pkg = JSON.parse(
        String(fs.readFileSync(path.join(ctx.ancestor, 'package.json')))
      )
      const relative = path.relative(ctx.ancestor, ctx.root)
      /** @type {boolean|undefined} */
      // @ts-expect-error: Custom field in plugins.
      const exclude = previous.excludeFromPreset

      const curr = {
        name: path.basename(ctx.root),
        version: previous.version,
        description: previous.description,
        license: pkg.license,
        keywords: previous.keywords,
        repository: pkg.repository + '/tree/main/' + relative,
        bugs: pkg.bugs,
        funding: pkg.funding,
        author: pkg.author,
        contributors: ctx.contributors || [pkg.author],
        browser: previous.browser || undefined,
        sideEffects: false,
        type: 'module',
        main: 'index.js',
        types: 'index.d.ts',
        files: ctx.files || previous.files,
        dependencies: previous.dependencies,
        scripts: {
          build: 'rimraf "*.d.ts" && tsc && type-coverage',
          test: ctx.tests ? 'node --conditions development test.js' : undefined
        },
        excludeFromPreset: exclude,
        xo: false,
        typeCoverage: {
          atLeast: 100,
          detail: true,
          strict: true,
          ignoreCatch: true
        }
      }

      ctx.package.value = JSON.stringify(curr, null, 2) + '\n'
    }
  )
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files?: Array<string>, tests?: boolean}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      fs.writeFile(ctx.package.path, ctx.package.value, next)
    }
  )
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files?: Array<string>, tests?: boolean}} ctx
     */
    (ctx) => {
      ctx.package.stored = true
    }
  )
