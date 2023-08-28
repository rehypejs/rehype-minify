import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-meta-content', async function (t) {
  await t.test('should work (`keywords`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('meta', {name: 'keywords', content: 'foo, bar baz, qux'})
          ])
        ),
      u('root', [h('meta', {name: 'keywords', content: 'foo,bar baz,qux'})])
    )
  })

  await t.test('should work `viewport`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('meta', {
              name: 'viewport',
              content:
                'width=device-width, initial-scale=1.0, user-scalable=yes'
            })
          ])
        ),
      u('root', [
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
        .runSync(u('root', [h('meta', {name: 'viewport', content: true})])),
      u('root', [h('meta', {name: 'viewport', content: true})])
    )
  })

  await t.test('should ignore missing', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('meta')])),
      u('root', [h('meta')])
    )
  })
})
