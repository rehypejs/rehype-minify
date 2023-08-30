import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-concat-javascript'

test('rehype-concat-javascript', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-concat-javascript')).sort(),
      ['default']
    )
  })

  await t.test('should concat scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('script', 'alert(1)'), h('script', 'alert(2)')])
        ),
      h(undefined, [h('script', 'alert(1);alert(2)')])
    )
  })

  await t.test('should concat scripts (w/ semicolons)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('script', 'alert(1);'), h('script', 'alert(2);')])
        ),
      h(undefined, [h('script', 'alert(1);;alert(2);')])
    )
  })

  await t.test('should not concat no-js scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('script', 'alert(1)'),
            h('script', {type: 'text/fooscript'}, 'alert(2)')
          ])
        ),
      h(undefined, [
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
          h(undefined, [
            h('script', 'alert(1)'),
            h('script', {src: 'foo'}),
            h('script', 'alert(2)')
          ])
        ),
      h(undefined, [
        h('script', 'alert(1);alert(2)'),
        h('script', {src: 'foo'})
      ])
    )
  })

  await t.test('should do nothing with one script', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', 'alert(1)')])),
      h(undefined, [h('script', 'alert(1)')])
    )
  })
})
