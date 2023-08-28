import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-normalize-attribute-value-case', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('form', {id: 'FOO', method: 'GET'})])),
      u('root', [h('form', {id: 'FOO', method: 'get'})])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('form', {method: true})])),
      u('root', [h('form', {method: true})])
    )
  })

  await t.test('should work on arrays', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('form', {acceptCharset: ['UTF8', 'UTF-8']})])),
      u('root', [h('form', {acceptCharset: ['utf8', 'utf-8']})])
    )
  })
})
