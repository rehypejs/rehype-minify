import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-javascript-url', async function (t) {
  await t.test('should work', async function () {
    /* eslint-disable no-script-url */
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('a', {id: 'foo', href: 'javascript:alert(false)'}, 'Hello')
          ])
        ),
      u('root', [h('a', {id: 'foo', href: 'javascript:alert(!1)'}, 'Hello')])
    )
  })

  await t.test('should ignore broken js', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('a', {href: 'javascript:alert(false'}, 'Hello')])
        ),
      u('root', [h('a', {href: 'javascript:alert(false'}, 'Hello')])
    )
  })

  await t.test('should ignore other urls', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('img', {src: 'http://example.com/fav.ico'})])),
      u('root', [h('img', {src: 'http://example.com/fav.ico'})])
    )
  })

  /* eslint-enable no-script-url */
})
