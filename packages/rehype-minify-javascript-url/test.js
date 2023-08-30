import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-minify-javascript-url'

test('rehype-minify-javascript-url', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-minify-javascript-url')).sort(),
      ['default']
    )
  })

  await t.test('should work', async function () {
    /* eslint-disable no-script-url */
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('a', {id: 'foo', href: 'javascript:alert(false)'}, 'Hello')
          ])
        ),
      h(undefined, [h('a', {id: 'foo', href: 'javascript:alert(!1)'}, 'Hello')])
    )
  })

  await t.test('should ignore broken js', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('a', {href: 'javascript:alert(false'}, 'Hello')])
        ),
      h(undefined, [h('a', {href: 'javascript:alert(false'}, 'Hello')])
    )
  })

  await t.test('should ignore other urls', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('img', {src: 'http://example.com/fav.ico'})])),
      h(undefined, [h('img', {src: 'http://example.com/fav.ico'})])
    )
  })

  /* eslint-enable no-script-url */
})
