'use strict'

var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')

var min = require('.')

test('rehype-minify-language', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('span', {lang: 'en-US'})),
    h('span', {lang: 'en'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('span', {xmlLang: '!'})),
    h('span', {xmlLang: '!'})
  )

  t.end()
})
