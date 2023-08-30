import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-normalize-attribute-value-case', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('form', {id: 'FOO', method: 'GET'})])),
      h(undefined, [h('form', {id: 'FOO', method: 'get'})])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('form', {method: true})])),
      h(undefined, [h('form', {method: true})])
    )
  })

  await t.test('should work on arrays', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('form', {acceptCharset: ['UTF8', 'UTF-8']})])),
      h(undefined, [h('form', {acceptCharset: ['utf8', 'utf-8']})])
    )
  })
})
