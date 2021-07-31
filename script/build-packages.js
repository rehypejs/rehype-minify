import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import {bail} from 'bail'
import {trough} from 'trough'
import {isHidden} from 'is-hidden'
import negate from 'negate'
import {pipelineRoot} from './pipeline-root.js'
import {pipelinePackage} from './pipeline-package.js'
import {pipelineReadme} from './pipeline-readme.js'
import {pipelinePresets} from './pipeline-presets.js'

var rootPath = process.cwd()
var packages = path.join(rootPath, 'packages')

fs.readdir(packages, function (error, basenames) {
  var plugins

  bail(error)

  basenames = basenames.filter(negate(isHidden))
  plugins = basenames.filter(plugin)

  // Generate all packages.
  basenames.forEach(function (basename) {
    trough()
      .use(function (ctx, next) {
        pipelinePackage.run(ctx, next)
      })
      .use(function (ctx, next) {
        ;(preset(basename) ? pipelinePresets : pipelineReadme).run(ctx, next)
      })
      .run(
        {
          ancestor: rootPath,
          root: path.join(packages, basename),
          plugins: plugins
        },
        wrap(basename)
      )
  })

  // Generate root `readme.md`.
  pipelineRoot.run(
    {root: rootPath, plugins: plugins},
    wrap(path.basename(rootPath))
  )

  function wrap(basename) {
    return done

    function done(error, ctx) {
      var key

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

function plugin(name) {
  return name.indexOf('rehype-') === 0 && !preset(name)
}

function preset(name) {
  return name.indexOf('rehype-preset-') === 0
}
