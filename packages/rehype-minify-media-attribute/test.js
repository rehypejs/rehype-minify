import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-media-attribute', async function (t) {
  await t.test('should work (`link`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('link', {media: '(min-width: 320px)', href: 'index.css'})
          ])
        ),
      u('root', [h('link', {media: '(min-width:320px)', href: 'index.css'})])
    )
  })

  await t.test('should work (`source`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('source', {media: '(min-width: 721px)', src: 'pear.jpg'})
          ])
        ),
      u('root', [h('source', {media: '(min-width:721px)', src: 'pear.jpg'})])
    )
  })

  await t.test('should drop `all`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('style', {media: 'all'}, '* {color: red}')])),
      u('root', [
        {
          type: 'element',
          tagName: 'style',
          // To do: `undefined`?
          properties: {media: null},
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
          u('root', [h('source', {media: '!important', src: 'pear.jpg'})])
        ),
      u('root', [h('source', {media: '!important', src: 'pear.jpg'})])
    )
  })

  await t.test('should ignore other elements', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('div')])),
      u('root', [h('div')])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('source', {media: true})])),
      u('root', [h('source', {media: true})])
    )
  })
})
