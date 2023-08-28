import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-json-script', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h(
              'script',
              {type: 'application/ld+json'},
              '{\n\t"@context": {}\n\t}'
            )
          ])
        ),
      u('root', [h('script', {type: 'application/ld+json'}, '{"@context":{}}')])
    )
  })

  await t.test('should do nothing with invalid json', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
          ])
        ),
      u('root', [
        h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
      ])
    )
  })

  await t.test('should ignore with other scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')])
        ),
      u('root', [h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')])
    )
  })
})
