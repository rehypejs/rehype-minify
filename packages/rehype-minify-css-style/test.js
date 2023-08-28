import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-css-style', async function (t) {
  await t.test('should minify', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('style', '* { color: #ff0000; }')])),
      u('root', [h('style', '*{color:red}')])
    )
  })

  await t.test('should ignore non-css', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('style', {type: 'foostyle'}, '* { color: #ff0000; }')])
        ),
      u('root', [h('style', {type: 'foostyle'}, '* { color: #ff0000; }')])
    )
  })

  await t.test('should ignore broken css (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('style', '* { color }')])),
      u('root', [h('style', '* { color }')])
    )
  })

  await t.test('should ignore broken css (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('style', '* { -webkit-: 0 0 2px rgba(#000, 0.4); }')])
        ),
      u('root', [h('style', '* { -webkit-: 0 0 2px rgba(#000, 0.4); }')])
    )
  })
})
