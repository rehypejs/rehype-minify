import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-remove-script-type-javascript'

test('rehype-remove-script-type-javascript', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-remove-script-type-javascript')).sort(),
      ['default']
    )
  })

  await t.test('should work (`type`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', {type: 'text/javascript'})])),
      h(undefined, [
        {
          type: 'element',
          tagName: 'script',
          properties: {type: undefined},
          children: []
        }
      ])
    )
  })

  await t.test('should work (`language`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', {language: 'javascript'})])),
      h(undefined, [
        {
          type: 'element',
          tagName: 'script',
          properties: {language: undefined},
          children: []
        }
      ])
    )
  })

  await t.test('should ignore non-js in `type`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', {type: 'fooscript'})])),
      h(undefined, [h('script', {type: 'fooscript'})])
    )
  })

  await t.test('should ignore non-js in `language`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', {language: 'fooscript'})])),
      h(undefined, [h('script', {language: 'fooscript'})])
    )
  })

  await t.test('should ignore w/o type or language', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', {type: 'module'})])),
      h(undefined, [h('script', {type: 'module'})])
    )
  })
})
