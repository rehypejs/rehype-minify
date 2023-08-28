import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-empty-attribute', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('label', {htmlFor: '', id: '', allowTransparency: ''})])
        ),
      u('root', [
        {
          type: 'element',
          tagName: 'label',
          // To do: `undefined`?
          properties: {allowTransparency: '', htmlFor: null, id: null},
          children: []
        }
      ])
    )
  })
})
