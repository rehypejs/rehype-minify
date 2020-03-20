'use strict'

var test = require('tape')
var rehype = require('rehype')
var u = require('unist-builder')
var h = require('hastscript')

var min = require('.')

test('rehype-concat-css-style', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('style', 'b {color: red}'), h('style', 'i {color: blue}')])
      ),
    u('root', [h('style', 'b {color: red}i {color: blue}')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('style', 'b {color: red}'),
          h('style', {type: 'text/foostyle'}, 'i {color: blue}')
        ])
      ),
    u('root', [
      h('style', 'b {color: red}'),
      h('style', {type: 'text/foostyle'}, 'i {color: blue}')
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('style', 'b {color: red}')])),
    u('root', [h('style', 'b {color: red}')])
  )

  t.end()
})
