import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-minify-meta-content', async function (t) {
  await t.test('should work (`keywords`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('meta', {name: 'keywords', content: 'foo, bar baz, qux'})
          ])
        ),
      h(undefined, [h('meta', {name: 'keywords', content: 'foo,bar baz,qux'})])
    )
  })

  await t.test('should work `viewport`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('meta', {
              name: 'viewport',
              content:
                'width=device-width, initial-scale=1.0, user-scalable=yes'
            })
          ])
        ),
      h(undefined, [
        h('meta', {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1'
        })
      ])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('meta', {name: 'viewport', content: true})])),
      h(undefined, [h('meta', {name: 'viewport', content: true})])
    )
  })

  await t.test('should ignore missing', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('meta')])),
      h(undefined, [h('meta')])
    )
  })
})
