import fs from 'fs'
import path from 'path'
import {toVFile} from 'to-vfile'
import {trough} from 'trough'

const filePipeline = trough()
  .use((ctx, next) => {
    toVFile.read(path.join(ctx.root, 'index.js'), (error, file) => {
      ctx.file = file
      next(error)
    })
  })
  .use((ctx) => {
    const doc = ctx.file.toString()
    let index = -1

    while (++index < ctx.plugins.length) {
      const name = ctx.plugins[index]

      const pack = JSON.parse(
        fs.readFileSync(
          path.join(ctx.ancestor, 'packages', name, 'package.json')
        )
      )
      const re = new RegExp('\\b' + name.slice('rehype-'.length) + '\\b')

      if (re.test(doc)) {
        if (pack.excludeFromPreset) {
          throw new Error('Did not expect `' + name + '` in `' + ctx.root + '`')
        }
      } else if (!pack.excludeFromPreset) {
        throw new Error('Expected `' + name + '` in `' + ctx.root + '`')
      }
    }
  })

export const pipelinePresets = trough().use((ctx, next) => {
  filePipeline.run(ctx, (error) => {
    next(error)
  })
})
