/**
 * @typedef {import('trough').Callback} Next
 * @typedef {import('vfile').VFile} VFile
 *
 * @typedef Result
 * @property {string} type
 * @property {number} outputSize
 * @property {number} gzipSize
 * @property {string} rawWin
 * @property {string} gzipWin
 *
 * @typedef CleanResult
 * @property {string} type
 * @property {number} raw
 * @property {number} gzip
 * @property {string} rawWin
 * @property {string} gzipWin
 *
 * @typedef Datum
 * @property {string} name
 * @property {string} url
 * @property {Array<CleanResult>} results
 *
 * @callback ProcessFn
 * @param {Uint8Array} buf
 * @param {{name: string}} ctx
 * @returns {Uint8Array}
 *
 * @typedef Raw
 * @property {ProcessFn} processFn
 * @property {'original'|'html-minifier'|'rehype-minify'} type
 * @property {Uint8Array} [input]
 * @property {number} [inputSize]
 * @property {Uint8Array} [output]
 * @property {number} [outputSize]
 * @property {Uint8Array} [gzipped]
 * @property {number} [gzipSize]
 * @property {Raw} [original]
 * @property {string} [rawWin]
 * @property {string} [gzipWin]
 * @property {string} name
 */

import {Buffer} from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import fetch from 'node-fetch'
import {bail} from 'bail'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {toVFile, read, write} from 'to-vfile'
import {trough} from 'trough'
import htmlMinifier from 'html-minifier'
import rehypePresetMinify from '../packages/rehype-preset-minify/index.js'
import rehypeMinifyDoctype from '../packages/rehype-minify-doctype/index.js'

const cache = 'benchmark-cache'

try {
  fs.mkdirSync(cache)
} catch {}

const benchmarks = trough()
  .use(
    /**
     * @param {Record<string, string>} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      /** @type {Array<Datum>} */
      const data = []
      const keys = Object.keys(ctx)
      let count = 0
      let index = -1

      while (++index < keys.length) {
        const name = keys[index]

        benchmark.run(
          {name, url: ctx[name]},
          /**
           * @param {Error?} error
           * @param {{name: string, url: string, file: VFile, original: Result, results: Array<Result>}} results
           */
          (error, results) => {
            count++

            if (error) {
              next(error)
            } else {
              data.push({
                name: results.name,
                url: results.url,
                results: [results.original]
                  .concat(results.results)
                  .map((d) => ({
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
          }
        )
      }
    }
  )
  .use(
    /**
     * @param {Array<Datum>} data
     * @param {Next} next
     */
    (data, next) => {
      data.sort((a, b) => a.name.localeCompare(b.name))

      fs.writeFile(
        path.join('script', 'benchmark-results.json'),
        JSON.stringify(data, null, 2) + '\n',
        next
      )
    }
  )

const benchmark = trough()
  .use(
    /**
     * @param {{name: string, url: string}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      fs.mkdir(path.join(cache, ctx.name), (error) => {
        next(error && error.code === 'EEXIST' ? null : error)
      })
    }
  )
  .use(
    /**
     * @param {{name: string, url: string, file?: VFile}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      read(path.join(cache, ctx.name, 'index.html'), (error, file) => {
        if (file) {
          ctx.file = file
          next()
        } else {
          next(error && error.code === 'ENOENT' ? null : error)
        }
      })
    }
  )
  .use(
    /**
     * @param {{name: string, url: string, file: VFile}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      const url = ctx.url

      if (ctx.file) {
        next()
      } else {
        fetch(url)
          .then((response) => {
            if (response.status !== 200) {
              throw new Error(
                'Could not get `' + url + '` (' + response.status + ')'
              )
            }

            return response.buffer()
          })
          .then((buf) => {
            const fp = path.join(cache, ctx.name, 'index.html')

            if (buf.length < 1024) {
              next(new Error('Empty response from ' + url))
            } else {
              ctx.file = toVFile({path: fp, value: buf})
              write(ctx.file, (error) => {
                next(error)
              })
            }
          })
      }
    }
  )
  .use(test)

const processorPipeline = trough()
  .use(
    /**
     * @param {Raw} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      if (!ctx.input) throw new Error('Expected `input`')

      const output = ctx.processFn(ctx.input, ctx)

      ctx.output = output

      if (ctx.type === 'original') {
        next()
      } else {
        const fp = path.join(cache, ctx.name, ctx.type + '.html')
        write({path: fp, value: output}, (error) => {
          next(error)
        })
      }
    }
  )
  .use(
    /**
     * @param {Raw} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      if (!ctx.output) throw new Error('Expected output')
      zlib.gzip(ctx.output, (error, buf) => {
        ctx.gzipped = buf
        next(error)
      })
    }
  )
  .use(
    /**
     * @param {Raw} ctx
     */
    (ctx) => {
      if (!ctx.input) throw new Error('Expected `input`')
      if (!ctx.gzipped) throw new Error('Expected `gzipped`')
      if (!ctx.output) throw new Error('Expected `output`')

      const original = ctx.original || {
        inputSize: ctx.input.length,
        gzipSize: ctx.gzipped.length
      }

      if (!original.inputSize) throw new Error('Expected `inputSize`')
      if (!original.gzipSize) throw new Error('Expected `gzipSize`')

      ctx.inputSize = ctx.input.length
      ctx.outputSize = ctx.output.length
      ctx.gzipSize = ctx.gzipped.length
      ctx.rawWin = win(original.inputSize, ctx.outputSize)
      ctx.gzipWin = win(original.gzipSize, ctx.gzipSize)

      /**
       * @param {number} input
       * @param {number} output
       * @returns {string}
       */
      function win(input, output) {
        return (((input / output) % 1) * 100).toFixed(2) + '%'
      }
    }
  )

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

/**
 * @param {{name: string, url: string, file: VFile, original?: Raw, results?: Array<Raw>}} ctx
 * @param {Next} next
 */
function test(ctx, next) {
  let count = 0
  /** @type {Raw} */
  const original = {
    name: ctx.name,
    processFn(buf) {
      return buf
    },
    type: 'original'
  }
  /** @type {Array<Raw>} */
  const results = [
    {
      name: ctx.name,
      processFn(buf) {
        // To do, fix
        // type-coverage:ignore-next-line
        const processor = unified()
          .use(rehypeParse)
          .use(rehypePresetMinify)
          .use(rehypeMinifyDoctype)
          .use(rehypeStringify)

        // @ts-expect-error: `value` is a string.
        return Buffer.from(processor.processSync(buf).value, 'utf8')
      },
      type: 'rehype-minify'
    },
    {
      name: ctx.name,
      processFn(buf, ctx) {
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
          ignoreCustomFragments: [
            /<#[\s\S]*?#>/,
            /<%[\s\S]*?%>/,
            /<\?[\s\S]*?\?>/
          ],
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
          const exception = /** @type {Error} */ (error)
          console.warn(
            'html-minifier error (%s)',
            ctx.name,
            String(exception.stack || '').slice(0, 2 ** 10)
          )
          return buf
        }
      },
      type: 'html-minifier'
    }
  ]

  ctx.original = original
  ctx.results = results

  if (!ctx.file.value || typeof ctx.file.value === 'string') {
    throw new Error('Expected buffer in file')
  }

  original.input = ctx.file.value

  processorPipeline.run(
    original,
    /**
     * @param {Error?} error
     */
    (error) => {
      if (error) {
        next(error)
        return
      }

      let index = -1

      while (++index < results.length) {
        const result = results[index]

        if (!ctx.file.value || typeof ctx.file.value === 'string') {
          throw new Error('Expected buffer in file')
        }

        result.original = original
        result.input = ctx.file.value
        result.name = ctx.name

        processorPipeline.run(
          result,
          /**
           * @param {Error?} error
           */
          (error) => {
            count++

            if (error || count === results.length) {
              next(error)
            }
          }
        )
      }
    }
  )
}
