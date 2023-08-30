import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-remove-comments'

test('rehype-remove-comments', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-remove-comments')).sort(),
      ['default']
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('div', [{type: 'comment', value: 'foo'}])])),
      h(undefined, [h('div')])
    )
  })

  await t.test('should ignore conditional comments', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])
          ])
        ),
      h(undefined, [h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])])
    )
  })

  await t.test(
    'should remove conditional comments w/ `removeConditional`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, {removeConditional: true})
          .runSync(
            h(undefined, [
              h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])
            ])
          ),
        h(undefined, [h('div')])
      )
    }
  )
})
