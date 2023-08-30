import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {isCssLink} from './index.js'

test('hast-util-is-css-link', async function (t) {
  await t.test(
    'should be yes for `link` with `[rel=stylesheet]` and no `[type]`',
    async function () {
      assert.equal(isCssLink(h('link', {rel: ['stylesheet']})), true)
    }
  )

  await t.test(
    'should be yes for `link` with multiple `rel`’s, including `stylesheet`, and no `[type]`',
    async function () {
      assert.equal(isCssLink(h('link', {rel: ['stylesheet', 'author']})), true)
    }
  )

  await t.test(
    'should be yes for `link` with `[rel=stylesheet]` and `[type=text/css]`',
    async function () {
      assert.equal(
        isCssLink(h('link', {rel: ['stylesheet'], type: 'text/css'})),
        true
      )
    }
  )

  await t.test(
    'should be yes for `link` with multiple `rel`’s, including `stylesheet`, and `[type=text/css]`',
    async function () {
      assert.equal(
        isCssLink(h('link', {rel: ['stylesheet', 'author'], type: 'text/css'})),
        true
      )
    }
  )

  await t.test(
    'should be no for `link` with `[rel=stylesheet]`, but a type other than `text/css`',
    async function () {
      assert.equal(
        isCssLink(h('link', {rel: ['stylesheet'], type: 'text/foo'})),
        false
      )
    }
  )

  await t.test('should be no for `link`s with other rel’s', async function () {
    assert.equal(isCssLink(h('link', {rel: ['author']})), false)
  })

  await t.test(
    'should be no for `link`s with other rel’s (2)',
    async function () {
      assert.equal(
        isCssLink(h('link', {rel: ['author'], type: 'text/css'})),
        false
      )
    }
  )

  await t.test('should be no for `link`s without `rel`', async function () {
    assert.equal(isCssLink(h('link')), false)
  })

  await t.test('should be no for non-links', async function () {
    assert.equal(isCssLink(h('p')), false)
  })

  await t.test('should be no for non-elements', async function () {
    assert.equal(isCssLink({type: 'text', value: 'foo'}), false)
  })
})
