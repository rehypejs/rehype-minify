'use strict'

var test = require('tape')
var rehype = require('rehype')
var u = require('unist-builder')

var min = require('.')

test('rehype-minify-doctype', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('doctype', {
          name: 'HTML',
          public: '-//W3C//DTD HTML 4.01//EN',
          system: 'http://www.w3.org/TR/html4/strict.dtd'
        })
      ),
    u('doctype', {name: 'HTML', public: null, system: null})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [u('doctype', {name: 'html'})])),
    u('root', [u('doctype', {name: 'html'})])
  )

  t.end()
})
