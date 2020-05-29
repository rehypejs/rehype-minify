'use strict'

var fs = require('fs')
var path = require('path')
var bytes = require('bytes')
var u = require('unist-builder')
var h = require('hastscript')
var trough = require('trough')
var unified = require('unified')
var format = require('rehype-format')
var stringify = require('rehype-stringify')
var remark = require('remark')
var zone = require('mdast-zone')
var vfile = require('to-vfile')
var remarkSettings = require('remark-preset-wooorm').settings

module.exports = trough()
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'readme.md'), function (err, file) {
      ctx.readme = file
      next(err)
    })
  })
  .use(function (ctx, next) {
    var others = []
    var core = []

    ctx.plugins.forEach(function (name) {
      var pack = require(path.join(ctx.root, 'packages', name, 'package.json'))
      ;(pack.excludeFromPreset ? others : core).push(name)
    })

    remark()
      .data('settings', remarkSettings)
      .use(plugin('plugins-core', core))
      .use(plugin('plugins-other', others))
      .use(benchmark)
      .process(ctx.readme, function (err) {
        next(err)
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
            {ordered: false},
            list.map(function (name) {
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
      var data

      try {
        data = JSON.parse(
          vfile.readSync({
            dirname: 'script',
            basename: 'benchmark-results.json'
          })
        )
      } catch (_) {}

      return data ? transform : undefined

      function transform(tree) {
        zone(tree, 'benchmark', visit)
      }

      function visit(start, nodes, end) {
        var types = ['raw', 'gzip']
        var h1 = [h('th', {rowSpan: 2}, 'name')]
        var h2 = []
        var foot = [h('th', {scope: 'row'}, 'total')]
        var sum = {}

        var body = data.map((d) => {
          var cells = [
            h(
              'th',
              {scope: 'row', align: 'left'},
              h('a', {href: d.url}, d.name)
            )
          ]

          types.forEach((type) => {
            var best

            d.results.slice(1).forEach((r) => {
              best = !best || r[type] < best[type] ? r : best
            })

            d.results.forEach((r) => {
              var key = type + ':' + r.type
              var value =
                r.type === 'original' ? bytes(r[type]) : r[type + 'Win']

              sum[key] = (sum[key] || 0) + r[type]

              if (value === '0.00%') {
                value = '💥'
              }

              if (r === best) {
                value = h('b', value)
              }

              cells.push(h('td', {align: 'right'}, value))
            })
          })

          return h('tr', cells)
        })

        types.forEach((type) => {
          var head = data[0]
          var cells = head.results.map((d) => h('th', d.type))
          h1.push(h('th', {colSpan: cells.length}, type))
          h2 = h2.concat(cells)
          foot = foot.concat(
            head.results.map((d) =>
              h('td', {align: 'right'}, bytes(sum[type + ':' + d.type]))
            )
          )
        })

        var tree = unified()
          .use(format)
          .runSync(
            h('table', [
              h('thead', h('tr', h1), h('tr', h2)),
              h('tbody', body),
              h('tfoot', h('tr', [foot]))
            ])
          )

        var fragment = unified().use(stringify).stringify(tree)

        return [start, u('html', fragment), end]
      }
    }
  })
  .use(function (ctx, next) {
    fs.writeFile(ctx.readme.path, ctx.readme.contents, function (err) {
      next(err)
    })
  })
  .use(function (ctx) {
    ctx.readme.stored = true
  })
