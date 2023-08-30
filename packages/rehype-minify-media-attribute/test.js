import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-minify-media-attribute'

test('rehype-minify-media-attribute', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-minify-media-attribute')).sort(),
      ['default']
    )
  })

  await t.test('should work (`link`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('link', {media: '(min-width: 320px)', href: 'index.css'})
          ])
        ),
      h(undefined, [h('link', {media: '(min-width:320px)', href: 'index.css'})])
    )
  })

  await t.test('should work (`source`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('source', {media: '(min-width: 721px)', src: 'pear.jpg'})
          ])
        ),
      h(undefined, [h('source', {media: '(min-width:721px)', src: 'pear.jpg'})])
    )
  })

  await t.test('should drop `all`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('style', {media: 'all'}, '* {color: red}')])),
      h(undefined, [
        {
          type: 'element',
          tagName: 'style',
          properties: {media: undefined},
          children: [{type: 'text', value: '* {color: red}'}]
        }
      ])
    )
  })

  await t.test('should ignore invalid queries', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('source', {media: '!important', src: 'pear.jpg'})])
        ),
      h(undefined, [h('source', {media: '!important', src: 'pear.jpg'})])
    )
  })

  await t.test('should ignore other elements', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('div')])),
      h(undefined, [h('div')])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('source', {media: true})])),
      h(undefined, [h('source', {media: true})])
    )
  })
})
