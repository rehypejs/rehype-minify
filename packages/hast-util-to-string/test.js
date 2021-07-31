import test from 'tape'
import {u} from 'unist-builder'
import {toString} from './index.js'

test('hast-util-to-string', function (t) {
  t.deepEqual(toString(u('comment', 'foo')), 'foo', 'should stringify comments')

  t.deepEqual(toString(u('text', 'foo')), 'foo', 'should stringify texts')

  t.deepEqual(
    toString(u('doctype', {name: 'html'})),
    '',
    'should return empty for doctypes'
  )

  t.deepEqual(
    toString(
      u('element', {tagName: 'p'}, [
        u('text', 'foo '),
        u('comment', 'bar'),
        u('element', {tagName: 'strong'}, [u('text', ' baz')])
      ])
    ),
    'foo  baz',
    'should stringify elements (including only descendant texts)'
  )

  t.deepEqual(
    toString(
      u('root', [
        u('doctype', {name: 'html'}),
        u('text', 'foo '),
        u('comment', 'bar'),
        u('element', {tagName: 'strong'}, [u('text', ' baz')])
      ])
    ),
    'foo  baz',
    'should stringify roots (including only descendant texts)'
  )

  t.end()
})
