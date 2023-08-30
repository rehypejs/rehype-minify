import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-remove-empty-attribute', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('label', {htmlFor: '', id: '', allowTransparency: ''})
          ])
        ),
      h(undefined, [
        {
          type: 'element',
          tagName: 'label',
          properties: {
            allowTransparency: '',
            htmlFor: undefined,
            id: undefined
          },
          children: []
        }
      ])
    )
  })
})
