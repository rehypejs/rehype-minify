import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-minify-json-script'

test('rehype-minify-json-script', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-minify-json-script')).sort(),
      ['default']
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h(
              'script',
              {type: 'application/ld+json'},
              '{\n\t"@context": {}\n\t}'
            )
          ])
        ),
      h(undefined, [
        h('script', {type: 'application/ld+json'}, '{"@context":{}}')
      ])
    )
  })

  await t.test('should do nothing with invalid json', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
          ])
        ),
      h(undefined, [
        h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
      ])
    )
  })

  await t.test('should ignore with other scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')])
        ),
      h(undefined, [h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')])
    )
  })
})
