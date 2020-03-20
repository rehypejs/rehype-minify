'use strict'

var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')

var min = require('.')

test('rehype-remove-style-type-css', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('link', {rel: ['stylesheet'], type: 'text/css'})),
    {
      type: 'element',
      tagName: 'link',
      properties: {rel: ['stylesheet'], type: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('style', {type: 'text/css'})),
    {type: 'element', tagName: 'style', properties: {type: null}, children: []}
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('link', {type: 'foostyle'})),
    h('link', {type: 'foostyle'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('style', {type: 'foostyle'})),
    h('style', {type: 'foostyle'})
  )

  t.end()
})
