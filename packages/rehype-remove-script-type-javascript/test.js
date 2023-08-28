import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-script-type-javascript', async function (t) {
  await t.test('should work (`type`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('script', {type: 'text/javascript'})])),
      u('root', [
        {
          type: 'element',
          tagName: 'script',
          // To do: `undefined`
          properties: {type: null},
          children: []
        }
      ])
    )
  })

  await t.test('should work (`language`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('script', {language: 'javascript'})])),
      u('root', [
        {
          type: 'element',
          tagName: 'script',
          // To do: `undefined`
          properties: {language: null},
          children: []
        }
      ])
    )
  })

  await t.test('should ignore non-js in `type`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('script', {type: 'fooscript'})])),
      u('root', [h('script', {type: 'fooscript'})])
    )
  })

  await t.test('should ignore non-js in `language`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('script', {language: 'fooscript'})])),
      u('root', [h('script', {language: 'fooscript'})])
    )
  })

  await t.test('should ignore w/o type or language', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('script', {type: 'module'})])),
      u('root', [h('script', {type: 'module'})])
    )
  })
})
