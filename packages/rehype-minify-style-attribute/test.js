import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-style-attribute', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('i', {style: 'color: #ff0000;'})])),
      u('root', [h('i', {style: 'color:red'})])
    )
  })

  await t.test('should ignore non-strings (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            {
              type: 'element',
              tagName: 'i',
              properties: {style: true},
              children: []
            }
          ])
        ),
      u('root', [
        {
          type: 'element',
          tagName: 'i',
          properties: {style: true},
          children: []
        }
      ])
    )
  })

  await t.test('should ignore non-strings (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            {
              type: 'element',
              tagName: 'i',
              properties: {style: 2},
              children: []
            }
          ])
        ),
      u('root', [
        {
          type: 'element',
          tagName: 'i',
          properties: {style: 2},
          children: []
        }
      ])
    )
  })

  await t.test('should work on empties', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('i', {style: ''})])),
      u('root', [
        {
          type: 'element',
          tagName: 'i',
          properties: {style: undefined},
          children: []
        }
      ])
    )
  })

  await t.test('should ignore non-css', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('i', {style: '!important'})])),
      u('root', [h('i', {style: '!important'})])
    )
  })

  await t.test('should ignore non-styles', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('i')])),
      u('root', [h('i')])
    )
  })
})
