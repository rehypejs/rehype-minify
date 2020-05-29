'use strict'

var test = require('tape')
var u = require('unist-builder')
var h = require('hastscript')

var ok = require('.')

test('hast-util-is-javascript', function (t) {
  t.ok(ok(h('script')), 'yes - for `script`')
  t.ok(ok(h('script', {src: 'index.js'})), 'yes - for `script` with src')
  t.ok(
    ok(h('script', {type: 'text/ecmascript'})),
    'yes - for `text/ecmascript` type'
  )
  t.ok(
    ok(h('script', {language: 'ecmascript'})),
    'yes - for `ecmascript` language'
  )
  t.ok(ok(h('script', {type: 'text/jscript'})), 'yes - for `text/jscript` type')
  t.ok(ok(h('script', {language: 'jscript'})), 'yes - for `jscript` language')
  t.ok(
    ok(h('script', {type: 'text/javascript1.5'})),
    'yes - for `text/javascript1.5` type'
  )
  t.ok(
    ok(h('script', {language: 'javascript1.5'})),
    'yes - for `javascript1.5` language'
  )

  t.notOk(ok(), 'no - for nothing')
  t.notOk(ok(u('root', [])), 'no - for other nodes')
  t.notOk(ok(h('p')), 'no - for other elements')
  t.notOk(ok(h('script', {type: true})), 'no - for non-string type')
  t.notOk(ok(h('script', {type: 'text/fooscript'})), 'no - for other type')
  t.ok(
    ok(h('script', {type: 'text/javascript', language: 'fooscript'})),
    'yes - for JS type with other language'
  )
  t.notOk(ok(h('script', {language: 'fooscript'})), 'no - for other language')
  t.notOk(ok(h('script', {language: true})), 'no - for non-string language')

  t.end()
})
