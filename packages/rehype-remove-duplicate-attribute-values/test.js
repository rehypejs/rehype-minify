import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-remove-duplicate-attribute-values', async function (t) {
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
