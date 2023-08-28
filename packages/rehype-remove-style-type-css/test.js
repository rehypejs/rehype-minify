import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-style-type-css', async function (t) {
  await t.test('should work on `link`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('link', {rel: ['stylesheet'], type: 'text/css'})])
        ),
      u('root', [
        {
          type: 'element',
          tagName: 'link',
          properties: {rel: ['stylesheet'], type: null},
          children: []
        }
      ])
    )
  })

  await t.test('should work on `style`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('style', {type: 'text/css'})])),
      u('root', [
        {
          type: 'element',
          tagName: 'style',
          properties: {type: null},
          children: []
        }
      ])
    )
  })

  await t.test('should ignore non-css on `link`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('link', {type: 'foostyle'})])),
      u('root', [h('link', {type: 'foostyle'})])
    )
  })

  await t.test('should ignore non-css on `type`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('style', {type: 'foostyle'})])),
      u('root', [h('style', {type: 'foostyle'})])
    )
  })
})
