'use strict'

var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')

var min = require('.')

test('rehype-minify-json-script', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('script', {type: 'application/ld+json'}, '{\n\t"@context": {}\n\t}')
      ),
    h('script', {type: 'application/ld+json'}, '{"@context":{}}')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
      ),
    h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')),
    h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')
  )

  t.end()
})
