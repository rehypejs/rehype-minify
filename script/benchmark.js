'use strict'

var fs = require('fs')
var path = require('path')
var zlib = require('zlib')
var https = require('https')
var bail = require('bail')
var chalk = require('chalk')
var concat = require('concat-stream')
var bytes = require('bytes')
var unified = require('unified')
var parse = require('rehype-parse')
var stringify = require('rehype-stringify')
var vfile = require('to-vfile')
var trough = require('trough')
var htmlMinify = require('html-minifier').minify
var rehypePresetMinify = require('../packages/rehype-preset-minify')
var minifyDoctype = require('../packages/rehype-minify-doctype')

var cache = 'benchmark-cache'

try {
  fs.mkdirSync(cache)
} catch (error) {}

var benchmarks = trough()
  .use(all)
  .use(save)

var benchmark = trough()
  .use(dir)
  .use(read)
  .use(request)
  .use(test)
  .use(clean)

var processorPipeline = trough()
  .use(process)
  .use(gzip)
  .use(size)

benchmarks.run(
  {
    amazon: 'https://www.amazon.co.uk/',
    bbc: 'https://www.bbc.co.uk/',
    bootstrap:
      'https://getbootstrap.com/docs/4.1/getting-started/introduction/',
    eloquent: 'https://eloquentjavascript.net/20_node.html',
    es6: 'https://kangax.github.io/compat-table/es6/',
    github: 'https://github.com',
    google: 'https://www.google.com/',
    guardian: 'https://www.theguardian.com/us',
    linkedin: 'https://www.linkedin.com/',
    microsoft: 'https://www.microsoft.com/en-us/',
    nbc: 'https://www.nbc.com/',
    npm: 'https://www.npmjs.com/',
    nytimes: 'https://www.nytimes.com/',
    rocketchat: 'https://rocket.chat',
    slack: 'https://slack.com/features',
    stackoverflow: 'https://stackoverflow.com/',
    tc39: 'https://tc39.github.io/ecma262/',
    twitter: 'https://twitter.com/',
    vice: 'https://www.vice.com/en_us',
    wikipedia: 'https://en.wikipedia.org/wiki/President_of_the_United_States'
  },
  bail
)

function all(ctx, next) {
  var keys = Object.keys(ctx)
  var count = 0

  keys.forEach(each)

  function each(name) {
    benchmark.run({name: name, url: ctx[name]}, done)

    function done(err, results) {
      count++

      if (err) {
        next(err)
      } else {
        ctx[name] = {
          url: results.url,
          input: {
            raw: results.original.inputSize,
            gzip: results.original.gzipSize
          },
          results: results.results
        }

        if (count === keys.length) {
          next()
        }
      }
    }
  }
}

function save(ctx, next) {
  console.log('save: ')
  console.dir(ctx, {depth: null})
  next()
}

function dir(ctx, next) {
  fs.mkdir(path.join(cache, ctx.name), done)

  function done(err) {
    next(err && err.code === 'EEXIST' ? null : err)
  }
}

function read(ctx, next) {
  vfile.read(path.join(cache, ctx.name, 'index.html'), done)

  function done(err, file) {
    if (file) {
      ctx.file = file
      next()
    } else {
      next(err && err.code === 'ENOENT' ? null : err)
    }
  }
}

function request(ctx, next) {
  var url = ctx.url

  if (ctx.file) {
    next()
  } else {
    https.get(url, onrequest)
  }

  function onrequest(res) {
    res.on('error', onerror)
    res.pipe(concat(onconcat))
  }

  function onerror(err) {
    next(new Error('Could not request `' + url + '`: ' + String(err)))
  }

  function onconcat(buf) {
    var fp = path.join(cache, ctx.name, 'index.html')

    if (buf.length === 0) {
      next(new Error('Empty response from ' + url))
    } else {
      ctx.file = vfile({path: fp, contents: buf})
      vfile.write(ctx.file, next)
    }
  }
}

function test(ctx, next) {
  var count = 0
  var original = {processFn: identity, type: 'original'}
  var results = [
    {processFn: rehypeMinify, type: 'rehype-minify'},
    {processFn: htmlMinifier, type: 'html-minifier'}
  ]

  ctx.original = original
  ctx.results = results

  original.input = ctx.file.contents
  original.name = ctx.name
  processorPipeline.run(original, all)

  function all(err) {
    if (err) {
      done(err)
    } else {
      results.forEach(each)
    }
  }

  function each(result) {
    result.original = original
    result.input = ctx.file.contents
    result.name = ctx.name
    processorPipeline.run(result, done)
  }

  function done(err) {
    count++

    if (err || count === results.length) {
      next(err)
    }
  }
}

function clean(ctx) {
  var best

  ctx.results = ctx.results.map(map)

  console.log(
    chalk.bold.green('✓ ' + ctx.name) +
      ' ' +
      ctx.results.map(stringify).join(', ')
  )

  function map(result) {
    var res = {type: result.type, raw: result.rawWin, gzip: result.gzipWin}
    best = !best || result.gzipSize < best.gzipSize ? result : best
    return res
  }

  function stringify(result) {
    var res = result.type === best.type ? chalk.bold(result.type) : result.type
    return res + ' (' + result.raw + ', ' + result.gzip + ')'
  }
}

function process(ctx, next) {
  var output = ctx.processFn(ctx.input, ctx)
  var fp

  ctx.output = output

  if (ctx.type === 'original') {
    next()
  } else {
    fp = path.join(cache, ctx.name, ctx.type + '.html')
    vfile.write({path: fp, contents: output}, next)
  }
}

function gzip(ctx, next) {
  zlib.gzip(ctx.output, done)

  function done(err, buf) {
    ctx.gzipped = buf
    next(err)
  }
}

function size(ctx) {
  var original = ctx.original || {
    inputSize: ctx.input.length,
    gzipSize: ctx.gzipped.length
  }

  ctx.inputSize = ctx.input.length
  ctx.outputSize = ctx.output.length
  ctx.gzipSize = ctx.gzipped.length
  ctx.raw = bytes(ctx.outputSize)
  ctx.gzip = bytes(ctx.gzipSize)
  ctx.rawWin = win(original.inputSize, ctx.outputSize)
  ctx.gzipWin = win(original.gzipSize, ctx.gzipSize)

  function win(input, output) {
    return (((input / output) % 1) * 100).toFixed(2) + '%'
  }
}

function htmlMinifier(buf, ctx) {
  // Based on:
  // https://github.com/kangax/html-minifier/blob/gh-pages/sample-cli-config-file.conf
  // but passed through the CLI normalization:
  // https://github.com/kangax/html-minifier/blob/346f73d/cli.js#L100
  // and defaults removed for brevity:
  // https://github.com/kangax/html-minifier
  var options = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    // CustomAttrCollapse: /.*/,
    decodeEntities: true,
    ignoreCustomFragments: [/<#[\s\S]*?#>/, /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/],
    includeAutoGeneratedTags: false,
    maxLineLength: 0,
    minifyCSS: true,
    minifyJS: true,
    processConditionalComments: true,
    processScripts: ['text/html'],
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    sortAttributes: true,
    sortClassName: true,
    trimCustomFragments: true,
    useShortDoctype: true
  }

  try {
    return Buffer.from(htmlMinify(String(buf), options), 'utf8')
  } catch (error) {
    console.warn(
      'html-minifier error (%s)',
      ctx.name,
      error.stack.slice(0, 2 ** 10)
    )
    return buf
  }
}

function rehypeMinify(buf) {
  var processor = unified()
    .use(parse)
    .use(rehypePresetMinify)
    .use(minifyDoctype)
    .use(stringify)

  return Buffer.from(processor.processSync(buf).contents, 'utf8')
}

function identity(buf) {
  return buf
}
