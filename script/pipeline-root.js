import fs from 'fs'
import path from 'path'
import bytes from 'bytes'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {trough} from 'trough'
import {unified} from 'unified'
import format from 'rehype-format'
import stringify from 'rehype-stringify'
import remark from 'remark'
import {zone} from 'mdast-zone'
import {toVFile} from 'to-vfile'
import remarkPresetWooorm from 'remark-preset-wooorm'

export const pipelineRoot = trough()
  .use((ctx, next) => {
    toVFile.read(path.join(ctx.root, 'readme.md'), (error, file) => {
      ctx.readme = file
      next(error)
    })
  })
  .use((ctx, next) => {
    const others = []
    const core = []
    let index = -1

    while (++index < ctx.plugins.length) {
      const name = ctx.plugins[index]
      const pack = JSON.parse(
        fs.readFileSync(path.join(ctx.root, 'packages', name, 'package.json'))
      )

      if (pack.excludeFromPreset) {
        others.push(name)
      } else {
        core.push(name)
      }
    }

    remark()
      .data('settings', remarkPresetWooorm.settings)
      .use(plugin('plugins-core', core))
      .use(plugin('plugins-other', others))
      .use(benchmark)
      .process(ctx.readme, (error) => {
        next(error)
      })

    function plugin(name, list) {
      return attacher

      function attacher() {
        return transform
      }

      function transform(tree) {
        zone(tree, name, visit)
      }

      function visit(start, nodes, end) {
        return [
          start,
          u(
            'list',
            {spread: false, ordered: false},
            list.map((name) => {
              return u('listItem', [
                u('link', {url: './packages/' + name}, [u('inlineCode', name)])
              ])
            })
          ),
          end
        ]
      }
    }

    function benchmark() {
      let data

      try {
        data = JSON.parse(
          toVFile.readSync({
            dirname: 'script',
            basename: 'benchmark-results.json'
          })
        )
      } catch {}

      return data ? transform : undefined

      function transform(tree) {
        zone(tree, 'benchmark', visit)
      }

      function visit(start, nodes, end) {
        const types = ['raw', 'gzip']
        const h1 = [h('th', {rowSpan: 2}, 'name')]
        let h2 = []
        let foot = [h('th', {scope: 'row'}, 'total')]
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
              let value =
                r.type === 'original' ? bytes(r[type]) : r[type + 'Win']

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

        const tree = unified()
          .use(format)
          .runSync(
            h('table', [
              h('thead', h('tr', h1), h('tr', h2)),
              h('tbody', body),
              h('tfoot', h('tr', [foot]))
            ])
          )

        const fragment = unified().use(stringify).stringify(tree)

        return [start, u('html', fragment), end]
      }
    }
  })
  .use((ctx, next) => {
    fs.writeFile(ctx.readme.path, ctx.readme.value, (error) => {
      next(error)
    })
  })
  .use((ctx) => {
    ctx.readme.stored = true
  })
