'use strict'

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')
var min = require('.')

test('rehype-minify-attribute-whitespace', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('input', {type: 'file', accept: ['  image/*', 'video/* ']})),
    h('input', {type: 'file', accept: ['image/*', 'video/*']})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('track', {src: '\talpha.vtt'})),
    h('track', {src: 'alpha.vtt'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('source', {src: 'video.ogv\n'})),
    h('source', {src: 'video.ogv'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('source', {src: true})),
    h('source', {src: true})
  )

  t.end()
})
