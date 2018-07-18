'use strict'

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape')
var u = require('unist-builder')
var h = require('hastscript')
var ok = require('.')

test('hast-util-is-css-style', function(t) {
  t.equal(ok(h('style')), true, 'yes - a `style` node')
  t.equal(ok(h('style', {type: null})), true, 'yes - `style` without `type`')
  t.equal(
    ok(h('style', {type: 'text/css'})),
    true,
    'yes - `style` with `[type=text/css]`'
  )
  t.equal(
    ok(h('style', {type: 'TEXT/CSS'})),
    true,
    'yes - `style` with `[type=TEXT/CSS]`'
  )
  t.equal(
    ok(h('style', {type: 'TeXt/CsS'})),
    true,
    'yes - `style` with `[type=TeXt/CsS]`'
  )
  t.equal(
    ok(h('style', {type: ' text/css '})),
    true,
    'yes - `style` with `[type= text/css ]`'
  )
  t.equal(
    ok(u('element', {tagName: 'style'})),
    true,
    'yes - without properties'
  )

  t.equal(
    ok(h('style', {type: 'text/foo'})),
    false,
    'no - `style` with `[type=text/foo]`'
  )
  t.equal(ok(h('div')), false, 'no - other elements')
  t.equal(ok(u('element', {tagName: 'p'})), false, 'no - other nodes')
  t.equal(ok(u('text', 'foo')), false, 'no - other nodes')
  t.equal(ok(), false, 'no - nothing')

  t.end()
})
