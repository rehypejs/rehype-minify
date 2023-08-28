import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {fromString} from './index.js'

test('hast-util-from-string', async function (t) {
  await t.test('should set text nodes', async function () {
    assert.deepEqual(
      // @ts-expect-error: `value` missing.
      fromString(u('text'), 'foo'),
      u('text', 'foo')
    )
  })

  await t.test('should reset text nodes (1)', async function () {
    assert.deepEqual(
      // @ts-expect-error: `value` missing.
      fromString(u('text')),
      u('text', '')
    )
  })

  await t.test('should reset text nodes (2)', async function () {
    assert.deepEqual(fromString(u('text', 'foo')), u('text', ''))
  })

  await t.test('should set parent nodes', async function () {
    assert.deepEqual(
      fromString(u('element', {tagName: 'p', properties: {}}, []), 'foo'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'foo')])
    )
  })

  await t.test('should reset parent nodes', async function () {
    assert.deepEqual(
      fromString(u('element', {tagName: 'p', properties: {}}, [])),
      u('element', {tagName: 'p', properties: {}}, [])
    )
  })
})
