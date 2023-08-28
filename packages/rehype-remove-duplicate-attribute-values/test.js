import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-duplicate-attribute-values', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('i', {className: ['foo', 'foo'], autoComplete: ['on', 'on']})
          ])
        ),
      u('root', [h('i', {className: ['foo'], autoComplete: ['on', 'on']})])
    )
  })
})
