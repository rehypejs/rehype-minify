import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-minify-meta-color'

test('rehype-minify-meta-color', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-minify-meta-color')).sort(),
      ['default']
    )
  })

  await t.test('should work (`theme-color`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('meta', {name: 'theme-color', content: '#ff0000'})])
        ),
      h(undefined, [h('meta', {name: 'theme-color', content: 'red'})])
    )
  })

  await t.test('should work (`msapplication-TileColor`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('meta', {name: 'msapplication-TileColor', content: '#00ff00'})
          ])
        ),
      h(undefined, [
        h('meta', {name: 'msapplication-TileColor', content: '#0f0'})
      ])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('meta', {name: 'theme-color', content: true})])
        ),
      h(undefined, [h('meta', {name: 'theme-color', content: true})])
    )
  })

  await t.test('should ignore missing', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('meta', {name: 'theme-color'})])),
      h(undefined, [h('meta', {name: 'theme-color'})])
    )
  })

  await t.test('should ignore empties', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('meta', {name: 'theme-color', content: ''})])),
      h(undefined, [h('meta', {name: 'theme-color', content: ''})])
    )
  })

  await t.test('should ignore invalid colors', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('meta', {name: 'theme-color', content: '#f'})])
        ),
      h(undefined, [h('meta', {name: 'theme-color', content: '#f'})])
    )
  })

  await t.test('should ignore unknown identifiers', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('meta', {name: 'theme-color', content: 'unknown'})])
        ),
      h(undefined, [h('meta', {name: 'theme-color', content: 'unknown'})])
    )
  })
})
