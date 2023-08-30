import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-remove-style-type-css', async function (t) {
  await t.test('should work on `link`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('link', {rel: ['stylesheet'], type: 'text/css'})])
        ),
      h(undefined, [
        {
          type: 'element',
          tagName: 'link',
          properties: {rel: ['stylesheet'], type: undefined},
          children: []
        }
      ])
    )
  })

  await t.test('should work on `style`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('style', {type: 'text/css'})])),
      h(undefined, [
        {
          type: 'element',
          tagName: 'style',
          properties: {type: undefined},
          children: []
        }
      ])
    )
  })

  await t.test('should ignore non-css on `link`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('link', {type: 'foostyle'})])),
      h(undefined, [h('link', {type: 'foostyle'})])
    )
  })

  await t.test('should ignore non-css on `type`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('style', {type: 'foostyle'})])),
      h(undefined, [h('style', {type: 'foostyle'})])
    )
  })
})
