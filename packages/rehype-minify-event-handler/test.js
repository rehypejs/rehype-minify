import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-event-handler', async function (t) {
  await t.test('should work', async function () {
    /* eslint-disable no-script-url */
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('h1', {onClick: 'javascript:alert(false)'}, 'Hello')])
        ),
      u('root', [h('h1', {onClick: 'alert(!1)'}, 'Hello')])
    )
    /* eslint-enable no-script-url */
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('button', {onClick: 'return false'}, 'Click me')])
        ),
      u('root', [h('button', {onClick: 'return!1'}, 'Click me')])
    )
  })

  await t.test('should keep broken js', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('button', {id: 'foo', onClick: 'alert('}, 'Click me')])
        ),
      u('root', [h('button', {id: 'foo', onClick: 'alert('}, 'Click me')])
    )
  })

  await t.test('should keep non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('button', {onCut: true}, 'Click me')])),
      u('root', [h('button', {onCut: true}, 'Click me')])
    )
  })
})
