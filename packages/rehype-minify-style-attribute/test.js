import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-minify-style-attribute'

test('rehype-minify-style-attribute', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-minify-style-attribute')).sort(),
      ['default']
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('i', {style: 'color: #ff0000;'})])),
      h(undefined, [h('i', {style: 'color:red'})])
    )
  })

  await t.test('should ignore non-strings (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            {
              type: 'element',
              tagName: 'i',
              properties: {style: true},
              children: []
            }
          ])
        ),
      h(undefined, [
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
          h(undefined, [
            {
              type: 'element',
              tagName: 'i',
              properties: {style: 2},
              children: []
            }
          ])
        ),
      h(undefined, [
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
        .runSync(h(undefined, [h('i', {style: ''})])),
      h(undefined, [
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
        .runSync(h(undefined, [h('i', {style: '!important'})])),
      h(undefined, [h('i', {style: '!important'})])
    )
  })

  await t.test('should ignore non-styles', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('i')])),
      h(undefined, [h('i')])
    )
  })
})
