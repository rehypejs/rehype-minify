import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-remove-external-script-content'

test('rehype-remove-external-script-content', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-remove-external-script-content')).sort(),
      ['default']
    )
  })

  await t.test('should ignore local scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', 'alert(true)')])),
      h(undefined, [h('script', 'alert(true)')])
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', {src: 'index.js'}, 'alert(true)')])),
      h(undefined, [h('script', {src: 'index.js'})])
    )
  })

  await t.test('should ignore non-js', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('script', {type: 'fooscript', src: 'index.js'}, 'alert(true)')
          ])
        ),
      h(undefined, [
        h('script', {type: 'fooscript', src: 'index.js'}, 'alert(true)')
      ])
    )
  })
})
