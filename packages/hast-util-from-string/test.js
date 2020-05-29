'use strict'

var test = require('tape')
var u = require('unist-builder')

var fromString = require('.')

test('hast-util-from-string', function (t) {
  t.deepEqual(
    fromString(u('text'), 'foo'),
    u('text', 'foo'),
    'should set text nodes'
  )

  t.deepEqual(
    fromString(u('text')),
    u('text', ''),
    'should reset text nodes (1)'
  )

  t.deepEqual(
    fromString(u('text', 'foo')),
    u('text', ''),
    'should reset text nodes (2)'
  )

  t.deepEqual(
    fromString(u('element', {tagName: 'p'}, []), 'foo'),
    u('element', {tagName: 'p'}, [u('text', 'foo')]),
    'should set parent nodes'
  )

  t.deepEqual(
    fromString(u('element', {tagName: 'p'}, [])),
    u('element', {tagName: 'p'}, []),
    'should reset parent nodes (1)'
  )

  t.deepEqual(
    fromString(u('element', {tagName: 'p'}, [u('text', 'foo')])),
    u('element', {tagName: 'p'}, []),
    'should reset parent nodes (2)'
  )

  t.end()
})
