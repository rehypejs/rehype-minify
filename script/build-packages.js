'use strict'

var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var bail = require('bail')
var trough = require('trough')
var hidden = require('is-hidden')
var negate = require('negate')
var root = require('./pipeline-root')
var pack = require('./pipeline-package')
var readme = require('./pipeline-readme')
var presets = require('./pipeline-presets')

var rootPath = path.join(__dirname, '..')
var packages = path.join(rootPath, 'packages')

fs.readdir(packages, function(err, basenames) {
  var plugins

  bail(err)

  basenames = basenames.filter(negate(hidden))
  plugins = basenames.filter(plugin)

  // Generate all packages.
  basenames.forEach(function(basename) {
    trough()
      .use(function(ctx, next) {
        pack.run(ctx, next)
      })
      .use(function(ctx, next) {
        ;(preset(basename) ? presets : readme).run(ctx, next)
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
  root.run({root: rootPath, plugins: plugins}, wrap(path.basename(rootPath)))

  function wrap(basename) {
    return done

    function done(err, ctx) {
      var key

      if (err) {
        console.error(chalk.red('✗ ') + basename)
        err.message = 'Could not process `' + basename + '`: ' + err.message
        throw err
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
