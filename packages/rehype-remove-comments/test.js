import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-comments', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('div', [{type: 'comment', value: 'foo'}])])),
      u('root', [h('div')])
    )
  })

  await t.test('should ignore conditional comments', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])
          ])
        ),
      u('root', [h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])])
    )
  })

  await t.test(
    'should remove conditional comments w/ `removeConditional`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, {removeConditional: true})
          .runSync(
            u('root', [
              h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])
            ])
          ),
        u('root', [h('div')])
      )
    }
  )
})
