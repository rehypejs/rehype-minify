import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-concat-css-style', async function (t) {
  await t.test('should concat styles', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('style', 'b {color: red}'),
            h('style', 'i {color: blue}')
          ])
        ),
      u('root', [h('style', 'b {color: red}i {color: blue}')])
    )
  })

  await t.test('should not concat non-css styles', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('style', 'b {color: red}'),
            h('style', {type: 'text/foostyle'}, 'i {color: blue}')
          ])
        ),
      u('root', [
        h('style', 'b {color: red}'),
        h('style', {type: 'text/foostyle'}, 'i {color: blue}')
      ])
    )
  })

  await t.test('should do nothing with one style', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('style', 'b {color: red}')])),
      u('root', [h('style', 'b {color: red}')])
    )
  })
})
