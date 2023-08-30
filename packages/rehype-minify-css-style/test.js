import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-minify-css-style'

test('rehype-minify-css-style', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-minify-css-style')).sort(),
      ['default']
    )
  })

  await t.test('should minify', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('style', '* { color: #ff0000; }')])),
      h(undefined, [h('style', '*{color:red}')])
    )
  })

  await t.test('should ignore non-css', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('style', {type: 'foostyle'}, '* { color: #ff0000; }')
          ])
        ),
      h(undefined, [h('style', {type: 'foostyle'}, '* { color: #ff0000; }')])
    )
  })

  await t.test('should ignore broken css (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('style', '* { color }')])),
      h(undefined, [h('style', '* { color }')])
    )
  })

  await t.test('should ignore broken css (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('style', '* { -webkit-: 0 0 2px rgba(#000, 0.4); }')])
        ),
      h(undefined, [h('style', '* { -webkit-: 0 0 2px rgba(#000, 0.4); }')])
    )
  })
})
