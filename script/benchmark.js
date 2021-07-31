import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import fetch from 'node-fetch'
import {bail} from 'bail'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {toVFile} from 'to-vfile'
import {trough} from 'trough'
import htmlMinifier from 'html-minifier'
import rehypePresetMinify from '../packages/rehype-preset-minify/index.js'
import rehypeMinifyDoctype from '../packages/rehype-minify-doctype/index.js'

const cache = 'benchmark-cache'

try {
  fs.mkdirSync(cache)
} catch {}

const benchmarks = trough().use(all).use(save)

const benchmark = trough().use(dir).use(read).use(request).use(test)

const processorPipeline = trough().use(process).use(gzip).use(size)

benchmarks.run(
  {
    amazon: 'https://www.amazon.co.uk/',
    bbc: 'https://www.bbc.co.uk/',
    bootstrap:
      'https://getbootstrap.com/docs/4.4/getting-started/introduction/',
    ecmascript: 'https://tc39.es/ecma262/',
    eloquent: 'https://eloquentjavascript.net/20_node.html',
    'compat table': 'https://kangax.github.io/compat-table/es6/',
    github: 'https://github.com',
    google: 'https://www.google.com/',
    guardian: 'https://www.theguardian.com/us',
    html: 'https://html.spec.whatwg.org',
    linkedin: 'https://www.linkedin.com/',
    microsoft: 'https://www.microsoft.com/en-us/',
    nbc: 'https://www.nbc.com/',
    npm: 'https://www.npmjs.com/',
    nytimes: 'https://www.nytimes.com/',
    rocketchat: 'https://rocket.chat',
    slack: 'https://slack.com/intl/en-gb/features',
    stackoverflow: 'https://stackoverflow.com/',
    twitter: 'https://twitter.com/',
    vice: 'https://www.vice.com/en_us',
    wikipedia: 'https://en.wikipedia.org/wiki/President_of_the_United_States'
  },
  bail
)

function all(ctx, next) {
  const data = []
  const keys = Object.keys(ctx)
  let count = 0
  let index = -1

  while (++index < keys.length) {
    const name = keys[index]

    benchmark.run({name, url: ctx[name]}, (error, results) => {
      count++

      if (error) {
        next(error)
      } else {
        data.push({
          name: results.name,
          url: results.url,
          results: [results.original].concat(results.results).map((d) => ({
            type: d.type,
            raw: d.outputSize,
            gzip: d.gzipSize,
            rawWin: d.rawWin,
            gzipWin: d.gzipWin
          }))
        })

        if (count === keys.length) {
          next(null, data)
        }
      }
    })
  }
}

function save(data, next) {
  data.sort((a, b) => a.name.localeCompare(b.name))

  fs.writeFile(
    path.join('script', 'benchmark-results.json'),
    JSON.stringify(data, null, 2) + '\n',
    next
  )
}

function dir(ctx, next) {
  fs.mkdir(path.join(cache, ctx.name), done)

  function done(error) {
    next(error && error.code === 'EEXIST' ? null : error)
  }
}

function read(ctx, next) {
  toVFile.read(path.join(cache, ctx.name, 'index.html'), done)

  function done(error, file) {
    if (file) {
      ctx.file = file
      next()
    } else {
      next(error && error.code === 'ENOENT' ? null : error)
    }
  }
}

function request(ctx, next) {
  const url = ctx.url

  if (ctx.file) {
    next()
  } else {
    fetch(url).then(onfetch).then(onbody)
  }

  function onfetch(response) {
    if (response.status !== 200) {
      throw new Error('Could not get `' + url + '` (' + response.status + ')')
    }

    return response.buffer()
  }

  function onbody(buf) {
    const fp = path.join(cache, ctx.name, 'index.html')

    if (buf.length < 1024) {
      next(new Error('Empty response from ' + url))
    } else {
      ctx.file = toVFile({path: fp, value: buf})
      toVFile.write(ctx.file, (error) => {
        next(error)
      })
    }
  }
}

function test(ctx, next) {
  let count = 0
  const original = {processFn: identity, type: 'original'}
  const results = [
    {processFn: rehypeMinify, type: 'rehype-minify'},
    {processFn: htmlMinify, type: 'html-minifier'}
  ]

  ctx.original = original
  ctx.results = results

  original.input = ctx.file.value
  original.name = ctx.name
  processorPipeline.run(original, all)

  function all(error) {
    if (error) {
      done(error)
      return
    }

    let index = -1
    while (++index < results.length) {
      const result = results[index]
      result.original = original
      result.input = ctx.file.value
      result.name = ctx.name
      processorPipeline.run(result, done)
    }
  }

  function done(error) {
    count++

    if (error || count === results.length) {
      next(error)
    }
  }
}

function process(ctx, next) {
  const output = ctx.processFn(ctx.input, ctx)

  ctx.output = output

  if (ctx.type === 'original') {
    next()
  } else {
    const fp = path.join(cache, ctx.name, ctx.type + '.html')
    toVFile.write({path: fp, value: output}, (error) => {
      next(error)
    })
  }
}

function gzip(ctx, next) {
  zlib.gzip(ctx.output, done)

  function done(error, buf) {
    ctx.gzipped = buf
    next(error)
  }
}

function size(ctx) {
  const original = ctx.original || {
    inputSize: ctx.input.length,
    gzipSize: ctx.gzipped.length
  }

  ctx.inputSize = ctx.input.length
  ctx.outputSize = ctx.output.length
  ctx.gzipSize = ctx.gzipped.length
  ctx.rawWin = win(original.inputSize, ctx.outputSize)
  ctx.gzipWin = win(original.gzipSize, ctx.gzipSize)

  function win(input, output) {
    return (((input / output) % 1) * 100).toFixed(2) + '%'
  }
}

function htmlMinify(buf, ctx) {
  // Based on:
  // <https://github.com/kangax/html-minifier/blob/gh-pages/sample-cli-config-file.conf>
  // but passed through the CLI normalization:
  // <https://github.com/kangax/html-minifier/blob/346f73d/cli.js#L100>
  // and defaults removed for brevity:
  // <https://github.com/kangax/html-minifier>
  const options = {
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
    return Buffer.from(htmlMinifier.minify(String(buf), options), 'utf8')
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
  const processor = unified()
    .use(rehypeParse)
    .use(rehypePresetMinify)
    .use(rehypeMinifyDoctype)
    .use(rehypeStringify)

  return Buffer.from(processor.processSync(buf).value, 'utf8')
}

function identity(buf) {
  return buf
}
