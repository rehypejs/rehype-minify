import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-javascript-to-bottom', async function (t) {
  await t.test('should move', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('head', [
              h('script', {src: 'index.js'}),
              h('script', 'alert(1);'),
              h('script', {type: 'fooscript', src: 'index.js'})
            ]),
            h('body', [])
          ])
        ),
      h(undefined, [
        h('head', [h('script', {type: 'fooscript', src: 'index.js'})]),
        h('body', [h('script', {src: 'index.js'}), h('script', 'alert(1);')])
      ])
    )
  })

  await t.test('should support `options.filter`', async function () {
    assert.deepEqual(
      rehype()
        .use(min, {
          filter(node) {
            return !/foo.js/.test(String(node.properties.src))
          }
        })
        .runSync(
          h(undefined, [
            h('head', [
              h('script', {src: 'index.js'}),
              h('script', {src: 'foo.js'})
            ]),
            h('body', [])
          ])
        ),
      h(undefined, [
        h('head', [h('script', {src: 'foo.js'})]),
        h('body', [h('script', {src: 'index.js'})])
      ])
    )
  })
})
