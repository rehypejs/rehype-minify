import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toString} from './index.js'

test('hast-util-to-string', async function (t) {
  await t.test('should stringify comments', async function () {
    assert.equal(toString({type: 'comment', value: 'foo'}), 'foo')
  })

  await t.test('should stringify texts', async function () {
    assert.equal(toString({type: 'text', value: 'foo'}), 'foo')
  })

  await t.test('should return empty for doctypes', async function () {
    assert.equal(toString({type: 'doctype'}), '')
  })

  await t.test(
    'should stringify elements (including only descendant texts)',
    async function () {
      assert.equal(
        toString(
          h('p', ['foo ', {type: 'comment', value: 'bar'}, h('strong', ' baz')])
        ),
        'foo  baz'
      )
    }
  )

  await t.test(
    'should stringify roots (including only descendant texts)',
    async function () {
      assert.equal(
        toString({
          type: 'root',
          children: [
            {type: 'doctype'},
            {type: 'text', value: 'foo '},
            {type: 'comment', value: 'bar'},
            h('strong', ' baz')
          ]
        }),
        'foo  baz'
      )
    }
  )
})
