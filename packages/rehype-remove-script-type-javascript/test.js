'use strict'

var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')

var min = require('.')

test('rehype-remove-script-type-javascript', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('script', {type: 'text/javascript'})),
    {type: 'element', tagName: 'script', properties: {type: null}, children: []}
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('script', {language: 'javascript'})),
    {
      type: 'element',
      tagName: 'script',
      properties: {language: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('script', {type: 'fooscript'})),
    h('script', {type: 'fooscript'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('script', {language: 'fooscript'})),
    h('script', {language: 'fooscript'})
  )

  t.end()
})
