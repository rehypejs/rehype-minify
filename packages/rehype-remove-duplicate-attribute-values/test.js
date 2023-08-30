import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-remove-duplicate-attribute-values'

test('rehype-remove-duplicate-attribute-values', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(
        await import('rehype-remove-duplicate-attribute-values')
      ).sort(),
      ['default']
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('i', {className: ['foo', 'foo'], autoComplete: ['on', 'on']})
          ])
        ),
      h(undefined, [h('i', {className: ['foo'], autoComplete: ['on', 'on']})])
    )
  })
})
