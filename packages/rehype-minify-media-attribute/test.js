'use strict'

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')
var min = require('.')

test('rehype-minify-media-attribute', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('link', {media: '(min-width: 320px)', href: 'index.css'})),
    h('link', {media: '(min-width:320px)', href: 'index.css'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('source', {media: '(min-width: 721px)', src: 'pear.jpg'})),
    h('source', {media: '(min-width:721px)', src: 'pear.jpg'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('style', {media: 'all'}, '* {color: red}')),
    {
      type: 'element',
      tagName: 'style',
      properties: {media: null},
      children: [{type: 'text', value: '* {color: red}'}]
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('source', {media: '!important', src: 'pear.jpg'})),
    h('source', {media: '!important', src: 'pear.jpg'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('div')),
    h('div')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('source', {media: true})),
    h('source', {media: true})
  )

  t.end()
})
