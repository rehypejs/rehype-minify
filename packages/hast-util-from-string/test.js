import test from 'tape'
import {u} from 'unist-builder'
import {fromString} from './index.js'

test('hast-util-from-string', (t) => {
  t.deepEqual(
    // @ts-expect-error: `value` missing.
    fromString(u('text'), 'foo'),
    u('text', 'foo'),
    'should set text nodes'
  )

  t.deepEqual(
    // @ts-expect-error: `value` missing.
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
    fromString(u('element', {tagName: 'p', properties: {}}, []), 'foo'),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'foo')]),
    'should set parent nodes'
  )

  t.deepEqual(
    fromString(u('element', {tagName: 'p', properties: {}}, [])),
    u('element', {tagName: 'p', properties: {}}, []),
    'should reset parent nodes (1)'
  )

  t.deepEqual(
    fromString(
      u('element', {tagName: 'p', properties: {}}, [u('text', 'foo')])
    ),
    u('element', {tagName: 'p', properties: {}}, []),
    'should reset parent nodes (2)'
  )

  t.end()
})
