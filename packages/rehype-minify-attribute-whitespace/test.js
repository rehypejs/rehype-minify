import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-minify-attribute-whitespace', async function (t) {
  await t.test('should minify', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync({
          type: 'root',
          children: [
            h('input', {type: 'file', accept: ['  image/*', 'video/* ']})
          ]
        }),
      {
        type: 'root',
        children: [h('input', {type: 'file', accept: ['image/*', 'video/*']})]
      }
    )
  })

  await t.test('should work on `track[src]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync({type: 'root', children: [h('track', {src: '\talpha.vtt'})]}),
      {type: 'root', children: [h('track', {src: 'alpha.vtt'})]}
    )
  })

  await t.test('should work on `source[src]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync({type: 'root', children: [h('source', {src: 'video.ogv\n'})]}),
      {type: 'root', children: [h('source', {src: 'video.ogv'})]}
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync({type: 'root', children: [h('source', {src: true})]}),
      {type: 'root', children: [h('source', {src: true})]}
    )
  })
})
