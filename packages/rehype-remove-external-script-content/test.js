import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-remove-external-script-content', async function (t) {
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
