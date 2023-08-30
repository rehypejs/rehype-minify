import assert from 'node:assert/strict'
import test from 'node:test'
import {fromString} from './index.js'

test('hast-util-from-string', async function (t) {
  await t.test('should set text nodes', async function () {
    assert.deepEqual(fromString({type: 'text', value: 'alpha'}, 'bravo'), {
      type: 'text',
      value: 'bravo'
    })
  })

  await t.test('should reset text nodes', async function () {
    assert.deepEqual(fromString({type: 'text', value: 'alpha'}), {
      type: 'text',
      value: ''
    })
  })

  await t.test('should set parent nodes', async function () {
    assert.deepEqual(
      fromString(
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [{type: 'text', value: 'alpha'}]
        },
        'bravo'
      ),
      {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [{type: 'text', value: 'bravo'}]
      }
    )
  })

  await t.test('should reset parent nodes', async function () {
    assert.deepEqual(
      fromString({
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [{type: 'text', value: 'alpha'}]
      }),
      {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: []
      }
    )
  })
})
