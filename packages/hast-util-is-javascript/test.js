import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {isJavaScript} from './index.js'

test('hast-util-is-javascript', async function (t) {
  await t.test('should be yes for `script`', async function () {
    assert.ok(isJavaScript(h('script')))
  })

  await t.test('should be yes for `script` with src', async function () {
    assert.ok(isJavaScript(h('script', {src: 'index.js'})))
  })

  await t.test('should be yes for `text/ecmascript` type', async function () {
    assert.ok(isJavaScript(h('script', {type: 'text/ecmascript'})))
  })

  await t.test('should be yes for `ecmascript` language', async function () {
    assert.ok(isJavaScript(h('script', {language: 'ecmascript'})))
  })

  await t.test('should be yes for `text/jscript` type', async function () {
    assert.ok(isJavaScript(h('script', {type: 'text/jscript'})))
  })

  await t.test('should be yes for `jscript` language', async function () {
    assert.ok(isJavaScript(h('script', {language: 'jscript'})))
  })

  await t.test(
    'should be yes for `text/javascript1.5` type',
    async function () {
      assert.ok(isJavaScript(h('script', {type: 'text/javascript1.5'})))
    }
  )

  await t.test('should be yes for `javascript1.5` language', async function () {
    assert.ok(isJavaScript(h('script', {language: 'javascript1.5'})))
  })

  await t.test('should be no for nothing', async function () {
    // @ts-expect-error: not enough arguments.
    assert.equal(isJavaScript(), false)
  })

  await t.test('should be no for other nodes', async function () {
    assert.equal(isJavaScript(u('root', [])), false)
  })

  await t.test('should be no for other elements', async function () {
    assert.equal(isJavaScript(h('p')), false)
  })

  await t.test('should be no for non-string type', async function () {
    assert.equal(isJavaScript(h('script', {type: true})), false)
  })

  await t.test('should be no for other type', async function () {
    assert.equal(isJavaScript(h('script', {type: 'text/fooscript'})), false)
  })

  await t.test(
    'should be yes for JS type with other language',
    async function () {
      assert.ok(
        isJavaScript(
          h('script', {type: 'text/javascript', language: 'fooscript'})
        )
      )
    }
  )

  await t.test('should be no for other language', async function () {
    assert.equal(isJavaScript(h('script', {language: 'fooscript'})), false)
  })

  await t.test('should be no for non-string language', async function () {
    assert.equal(isJavaScript(h('script', {language: true})), false)
  })
})
