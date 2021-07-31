import fs from 'fs'
import path from 'path'
import {exec} from 'child_process'
import vfile from 'to-vfile'
import findDown from 'vfile-find-down'
import trough from 'trough'
import uniq from 'uniq'

export const pipelinePackage = trough()
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'package.json'), function (error, file) {
      ctx.package = file
      next(error)
    })
  })
  .use(function (ctx, next) {
    var fp = path.relative(ctx.ancestor, ctx.root)
    var cmd = 'git log --all --format="%cN <%cE>" "' + fp + '"'

    exec(cmd, function (error, stdout) {
      if (error) return next(error)

      ctx.contributors = uniq(stdout.split('\n'))
        .sort()
        .filter(Boolean)
        .filter((d) => !d.includes('<noreply'))

      if (ctx.contributors.length === 0) {
        ctx.contributors = null
      }

      next()
    })
  })
  .use(function (ctx, next) {
    findDown.all(['.js', '.json'], ctx.root, function (error, files) {
      if (files) {
        ctx.files = files
          .map(function (file) {
            return path.relative(ctx.root, file.path)
          })
          .filter(function (name) {
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
  .use(function (ctx) {
    var previous = JSON.parse(ctx.package)
    var pkg = JSON.parse(
      fs.readFileSync(path.join(ctx.ancestor, 'package.json'))
    )
    var relative = path.relative(ctx.ancestor, ctx.root)

    var curr = {
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

    ctx.package.contents = JSON.stringify(curr, 0, 2) + '\n'
  })
  .use(function (ctx, next) {
    fs.writeFile(ctx.package.path, ctx.package.contents, next)
  })
  .use(function (ctx) {
    ctx.package.stored = true
  })
