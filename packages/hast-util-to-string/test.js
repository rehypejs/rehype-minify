import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {toString} from './index.js'

test('hast-util-to-string', async function (t) {
  await t.test('should stringify comments', async function () {
    assert.deepEqual(toString(u('comment', 'foo')), 'foo')
  })

  await t.test('should stringify texts', async function () {
    assert.deepEqual(toString(u('text', 'foo')), 'foo')
  })

  await t.test('should return empty for doctypes', async function () {
    assert.deepEqual(toString(u('doctype', {name: 'html'})), '')
  })

  await t.test(
    'should stringify elements (including only descendant texts)',
    async function () {
      assert.deepEqual(
        toString(
          u('element', {tagName: 'p', properties: {}}, [
            u('text', 'foo '),
            u('comment', 'bar'),
            u('element', {tagName: 'strong', properties: {}}, [
              u('text', ' baz')
            ])
          ])
        ),
        'foo  baz'
      )
    }
  )

  await t.test(
    'should stringify roots (including only descendant texts)',
    async function () {
      assert.deepEqual(
        toString(
          u('root', [
            u('doctype', {name: 'html'}),
            u('text', 'foo '),
            u('comment', 'bar'),
            u('element', {tagName: 'strong', properties: {}}, [
              u('text', ' baz')
            ])
          ])
        ),
        'foo  baz'
      )
    }
  )
})
