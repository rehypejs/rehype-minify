import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-concat-javascript', async function (t) {
  await t.test('should concat scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('script', 'alert(1)'), h('script', 'alert(2)')])),
      u('root', [h('script', 'alert(1);alert(2)')])
    )
  })

  await t.test('should concat scripts (w/ semicolons)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('script', 'alert(1);'), h('script', 'alert(2);')])
        ),
      u('root', [h('script', 'alert(1);;alert(2);')])
    )
  })

  await t.test('should not concat no-js scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('script', 'alert(1)'),
            h('script', {type: 'text/fooscript'}, 'alert(2)')
          ])
        ),
      u('root', [
        h('script', 'alert(1)'),
        h('script', {type: 'text/fooscript'}, 'alert(2)')
      ])
    )
  })

  await t.test('should leave scripts w/ `src`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('script', 'alert(1)'),
            h('script', {src: 'foo'}),
            h('script', 'alert(2)')
          ])
        ),
      u('root', [h('script', 'alert(1);alert(2)'), h('script', {src: 'foo'})])
    )
  })

  await t.test('should do nothing with one script', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('script', 'alert(1)')])),
      u('root', [h('script', 'alert(1)')])
    )
  })
})
