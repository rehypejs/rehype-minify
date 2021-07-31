import fs from 'fs'
import path from 'path'
import {exec} from 'child_process'
import {toVFile} from 'to-vfile'
import {findDown} from 'vfile-find-down'
import {trough} from 'trough'

export const pipelinePackage = trough()
  .use((ctx, next) => {
    toVFile.read(path.join(ctx.root, 'package.json'), (error, file) => {
      ctx.package = file
      next(error)
    })
  })
  .use((ctx, next) => {
    const fp = path.relative(ctx.ancestor, ctx.root)
    const cmd = 'git log --all --format="%cN <%cE>" "' + fp + '"'

    exec(cmd, (error, stdout) => {
      if (error) return next(error)

      ctx.contributors = [...new Set(stdout.split('\n'))]
        .sort()
        .filter(Boolean)
        .filter((d) => !d.includes('<noreply'))

      if (ctx.contributors.length === 0) {
        ctx.contributors = null
      }

      next()
    })
  })
  .use((ctx, next) => {
    findDown(['.js', '.json'], ctx.root, (error, files) => {
      if (files) {
        ctx.files = files
          .map((file) => {
            return path.relative(ctx.root, file.path)
          })
          .filter((name) => {
            if (name === 'package.json' || /(example)/.test(name)) {
              return false
            }

            if (/(test)/.test(name)) {
              ctx.tests = true
              return false
            }

            return true
          })
          .sort()
      }

      next(error)
    })
  })
  .use((ctx) => {
    const previous = JSON.parse(ctx.package)
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ctx.ancestor, 'package.json'))
    )
    const relative = path.relative(ctx.ancestor, ctx.root)

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
      files: ctx.files || previous.files,
      dependencies: previous.dependencies,
      scripts: ctx.tests ? {test: 'node --conditions development test.js'} : {},
      excludeFromPreset: previous.excludeFromPreset,
      xo: false
    }

    ctx.package.value = JSON.stringify(curr, 0, 2) + '\n'
  })
  .use((ctx, next) => {
    fs.writeFile(ctx.package.path, ctx.package.value, next)
  })
  .use((ctx) => {
    ctx.package.stored = true
  })
