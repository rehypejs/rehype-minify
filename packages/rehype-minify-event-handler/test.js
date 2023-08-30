import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-minify-event-handler', async function (t) {
  await t.test('should work', async function () {
    /* eslint-disable no-script-url */
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('h1', {onClick: 'javascript:alert(false)'}, 'Hello')])
        ),
      h(undefined, [h('h1', {onClick: 'alert(!1)'}, 'Hello')])
    )
    /* eslint-enable no-script-url */
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('button', {onClick: 'return false'}, 'Click me')])
        ),
      h(undefined, [h('button', {onClick: 'return!1'}, 'Click me')])
    )
  })

  await t.test('should keep broken js', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('button', {id: 'foo', onClick: 'alert('}, 'Click me')
          ])
        ),
      h(undefined, [h('button', {id: 'foo', onClick: 'alert('}, 'Click me')])
    )
  })

  await t.test('should keep non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('button', {onCut: true}, 'Click me')])),
      h(undefined, [h('button', {onCut: true}, 'Click me')])
    )
  })
})
