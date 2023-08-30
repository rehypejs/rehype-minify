import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-concat-css-style'

test('rehype-concat-css-style', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-concat-css-style')).sort(),
      ['default']
    )
  })

  await t.test('should concat styles', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('style', 'b {color: red}'),
            h('style', 'i {color: blue}')
          ])
        ),
      h(undefined, [h('style', 'b {color: red}i {color: blue}')])
    )
  })

  await t.test('should not concat non-css styles', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('style', 'b {color: red}'),
            h('style', {type: 'text/foostyle'}, 'i {color: blue}')
          ])
        ),
      h(undefined, [
        h('style', 'b {color: red}'),
        h('style', {type: 'text/foostyle'}, 'i {color: blue}')
      ])
    )
  })

  await t.test('should do nothing with one style', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('style', 'b {color: red}')])),
      h(undefined, [h('style', 'b {color: red}')])
    )
  })
})
