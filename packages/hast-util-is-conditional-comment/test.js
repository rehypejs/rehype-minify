import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {isConditionalComment} from './index.js'

test('hast-util-is-conditional-comment', async function (t) {
  await t.test('should detect a bunch of comments', async function () {
    const fixtures = [
      '[if IE]>…<![endif]',
      '[if IE 6]>…<![endif]',
      '[if IE 7]>…<![endif]',
      '[if IE 8]>…<![endif]',
      '[if IE 9]>…<![endif]',
      '[if gte IE 8]>…<![endif]',
      '[if lt IE 9]>…<![endif]',
      '[if lte IE 7]>…<![endif]',
      '[if gt IE 6]>…<![endif]',
      '[if !IE]>',
      '<![endif]'
    ]
    let index = -1

    while (++index < fixtures.length) {
      assert.equal(isConditionalComment(u('comment', fixtures[index])), true)
    }
  })

  await t.test('should be no for other comments', async function () {
    assert.equal(
      // @ts-expect-error: incorrect node.
      isConditionalComment(u('comments', 'foo')),
      false
    )
  })

  await t.test('should be no for elements', async function () {
    assert.equal(isConditionalComment(h('div')), false)
  })

  await t.test('should be no for texts', async function () {
    assert.equal(isConditionalComment(u('text', 'foo')), false)
  })
})
