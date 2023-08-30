import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {isCssStyle} from './index.js'

test('hast-util-is-css-style', async function (t) {
  await t.test('should be yes for a `style` node', async function () {
    assert.equal(isCssStyle(h('style')), true)
  })

  await t.test('should be yes for `style` without `type`', async function () {
    assert.equal(isCssStyle(h('style', {type: undefined})), true)
  })

  await t.test(
    'should be yes for `style` with `[type=text/css]`',
    async function () {
      assert.equal(isCssStyle(h('style', {type: 'text/css'})), true)
    }
  )

  await t.test(
    'should be yes for `style` with `[type=TEXT/CSS]`',
    async function () {
      assert.equal(isCssStyle(h('style', {type: 'TEXT/CSS'})), true)
    }
  )

  await t.test(
    'should be yes for `style` with `[type=TeXt/CsS]`',
    async function () {
      assert.equal(isCssStyle(h('style', {type: 'TeXt/CsS'})), true)
    }
  )

  await t.test(
    'should be yes for `style` with `[type= text/css ]`',
    async function () {
      assert.equal(isCssStyle(h('style', {type: ' text/css '})), true)
    }
  )

  await t.test(
    'should be no for `style` with `[type=text/foo]`',
    async function () {
      assert.equal(isCssStyle(h('style', {type: 'text/foo'})), false)
    }
  )

  await t.test('should be no for other elements', async function () {
    assert.equal(isCssStyle(h('div')), false)
  })

  await t.test('should be no for other nodes', async function () {
    assert.equal(isCssStyle({type: 'text', value: 'foo'}), false)
  })
})
