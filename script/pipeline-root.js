/**
 * @typedef {import('trough').Callback} Next
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('./benchmark-results.json')} BenchmarkResult
 * @typedef {import('mdast').Root} Root
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('hast').Element} Element
 * @typedef {Element['children'][number]} ElementChild
 */

import fs from 'node:fs'
import path from 'node:path'
import bytes from 'bytes'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {trough} from 'trough'
import {unified} from 'unified'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import {remark} from 'remark'
import {zone} from 'mdast-zone'
import {read, readSync} from 'to-vfile'
import remarkPresetWooorm from 'remark-preset-wooorm'

export const pipelineRoot = trough()
  .use(
    /**
     * @param {{root: string, plugins: Array<string>, readme?: VFile}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      read(path.join(ctx.root, 'readme.md'), (error, file) => {
        if (file) {
          ctx.readme = file
        }

        next(error)
      })
    }
  )
  .use(
    /**
     * @param {{root: string, plugins: Array<string>, readme: VFile}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      /** @type {Array<string>} */
      const others = []
      /** @type {Array<string>} */
      const core = []
      let index = -1

      while (++index < ctx.plugins.length) {
        const name = ctx.plugins[index]
        /** @type {PackageJson} */
        const pack = JSON.parse(
          String(
            fs.readFileSync(
              path.join(ctx.root, 'packages', name, 'package.json')
            )
          )
        )

        /** @type {boolean|undefined} */
        // @ts-expect-error: Custom field in plugins.
        const exclude = pack.excludeFromPreset

        if (exclude) {
          others.push(name)
        } else {
          core.push(name)
        }
      }

      /** @type {import('unified').Processor<Root, undefined, undefined, Root, string>} */
      // @ts-expect-error: to do: remove when `remark` is released.
      const processor = remark()

      processor
        .data('settings', remarkPresetWooorm.settings)
        .use(plugin('plugins-core', core))
        .use(plugin('plugins-other', others))
        .use(benchmark)
        .process(ctx.readme, (error) => {
          next(error)
        })

      /**
       * @param {string} name
       * @param {Array<string>} list
       */
      function plugin(name, list) {
        return attacher

        function attacher() {
          /**
           * @param {Root} tree
           * @returns {undefined}
           */
          return (tree) => {
            zone(tree, name, (start, _, end) => [
              start,
              {
                type: 'list',
                spread: false,
                ordered: false,
                children: list.map((name) => ({
                  type: 'listItem',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'link',
                          url: './packages/' + name,
                          children: [{type: 'inlineCode', value: name}]
                        }
                      ]
                    }
                  ]
                }))
              },
              end
            ])
          }
        }
      }

      /** @type {import('unified').Plugin<[], Root>} */
      function benchmark() {
        /** @type {BenchmarkResult} */
        let data

        try {
          data = JSON.parse(
            String(
              readSync({
                dirname: 'script',
                basename: 'benchmark-results.json'
              })
            )
          )
        } catch {
          return
        }

        return (tree) => {
          zone(tree, 'benchmark', (start, _, end) => {
            /** @type {['raw', 'gzip']} */
            const types = ['raw', 'gzip']
            /** @type {Array<ElementChild>} */
            const h1 = [h('th', {rowSpan: 2}, 'name')]
            /** @type {Array<ElementChild>} */
            let h2 = []
            /** @type {Array<ElementChild>} */
            let foot = [h('th', {scope: 'row'}, 'total')]
            /** @type {Record<string, number>} */
            const sum = {}

            const body = data.map((d) => {
              const cells = [
                h(
                  'th',
                  {scope: 'row', align: 'left'},
                  h('a', {href: d.url}, d.name)
                )
              ]

              let index = -1

              while (++index < types.length) {
                const type = types[index]
                let offset = 0 // Skip first.
                /** @type {BenchmarkResult[number]['results'][number]|undefined}} */
                let best

                while (++offset < d.results.length) {
                  if (!best || d.results[offset][type] < best[type]) {
                    best = d.results[offset]
                  }
                }

                offset = -1

                while (++offset < d.results.length) {
                  const r = d.results[offset]
                  const key = type + ':' + r.type
                  /** @type {`${type}Win`} */
                  // @ts-expect-error: hush.
                  const win = type + 'Win'
                  /** @type {string|Element} */
                  let value = r.type === 'original' ? bytes(r[type]) : r[win]

                  sum[key] = (sum[key] || 0) + r[type]

                  if (value === '0.00%') {
                    value = '💥'
                  }

                  if (r === best) {
                    value = h('b', value)
                  }

                  cells.push(h('td', {align: 'right'}, value))
                }
              }

              return h('tr', cells)
            })

            let index = -1

            while (++index < types.length) {
              const type = types[index]
              const head = data[0]
              const cells = head.results.map((d) => h('th', d.type))
              h1.push(h('th', {colSpan: cells.length}, type))
              h2 = h2.concat(cells)
              foot = foot.concat(
                head.results.map((d) =>
                  h('td', {align: 'right'}, bytes(sum[type + ':' + d.type]))
                )
              )
            }

            /** @type {import('unified').Processor<undefined, HastRoot, HastRoot, HastRoot, string>} */
            // @ts-expect-error: to do: remove when `rehype-format` is released.
            const processor = unified().use(rehypeFormat).use(rehypeStringify)

            const tree = processor.runSync(
              // @ts-expect-error: fine.
              h('table', [
                h('thead', h('tr', h1), h('tr', h2)),
                h('tbody', body),
                h('tfoot', h('tr', foot))
              ])
            )

            const fragment = processor.stringify(tree)

            return [start, u('html', fragment), end]
          })
        }
      }
    }
  )
  .use(
    /**
     * @param {{root: string, plugins: Array<string>, readme: VFile}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      fs.writeFile(ctx.readme.path, ctx.readme.value, (error) => {
        next(error)
      })
    }
  )
  .use(
    /**
     * @param {{root: string, plugins: Array<string>, readme: VFile}} ctx
     */
    (ctx) => {
      ctx.readme.stored = true
    }
  )
