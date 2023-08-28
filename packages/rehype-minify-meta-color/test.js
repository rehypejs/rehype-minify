import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-meta-color', async function (t) {
  await t.test('should work (`theme-color`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('meta', {name: 'theme-color', content: '#ff0000'})])
        ),
      u('root', [h('meta', {name: 'theme-color', content: 'red'})])
    )
  })

  await t.test('should work (`msapplication-TileColor`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('meta', {name: 'msapplication-TileColor', content: '#00ff00'})
          ])
        ),
      u('root', [h('meta', {name: 'msapplication-TileColor', content: '#0f0'})])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('meta', {name: 'theme-color', content: true})])),
      u('root', [h('meta', {name: 'theme-color', content: true})])
    )
  })

  await t.test('should ignore missing', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('meta', {name: 'theme-color'})])),
      u('root', [h('meta', {name: 'theme-color'})])
    )
  })

  await t.test('should ignore empties', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('meta', {name: 'theme-color', content: ''})])),
      u('root', [h('meta', {name: 'theme-color', content: ''})])
    )
  })

  await t.test('should ignore invalid colors', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('meta', {name: 'theme-color', content: '#f'})])),
      u('root', [h('meta', {name: 'theme-color', content: '#f'})])
    )
  })

  await t.test('should ignore unknown identifiers', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('meta', {name: 'theme-color', content: 'unknown'})])
        ),
      u('root', [h('meta', {name: 'theme-color', content: 'unknown'})])
    )
  })
})
