import fs from 'fs'
import path from 'path'
import vfile from 'to-vfile'
import trough from 'trough'

var filePipeline = trough()
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'index.js'), function (error, file) {
      ctx.file = file
      next(error)
    })
  })
  .use(function (ctx) {
    var doc = ctx.file.toString()

    ctx.plugins.forEach(function (name) {
      var pack = JSON.parse(
        fs.readFileSync(
          path.join(ctx.ancestor, 'packages', name, 'package.json')
        )
      )
      var re = new RegExp('\\b' + name.slice('rehype-'.length) + '\\b')

      if (re.test(doc)) {
        if (pack.excludeFromPreset) {
          throw new Error('Did not expect `' + name + '` in `' + ctx.root + '`')
        }
      } else if (!pack.excludeFromPreset) {
        throw new Error('Expected `' + name + '` in `' + ctx.root + '`')
      }
    })
  })

export const pipelinePresets = trough().use(function (ctx, next) {
  filePipeline.run(ctx, function (error) {
    next(error)
  })
})
