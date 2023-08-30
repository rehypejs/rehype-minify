/**
 * @typedef {import('hast').Nodes} Nodes
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {fromString} from 'hast-util-from-string'

test('hast-util-from-string', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('hast-util-from-string')).sort(),
      ['fromString']
    )
  })

  await t.test('should set text nodes', async function () {
    /** @type {Nodes} */
    const node = {type: 'text', value: 'alpha'}
    fromString(node, 'bravo')
    assert.deepEqual(node, {type: 'text', value: 'bravo'})
  })

  await t.test('should reset text nodes', async function () {
    /** @type {Nodes} */
    const node = {type: 'text', value: 'alpha'}
    fromString(node)
    assert.deepEqual(node, {type: 'text', value: ''})
  })

  await t.test('should set parent nodes', async function () {
    /** @type {Nodes} */
    const node = {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{type: 'text', value: 'alpha'}]
    }
    fromString(node, 'bravo')

    assert.deepEqual(node, {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{type: 'text', value: 'bravo'}]
    })
  })

  await t.test('should reset parent nodes', async function () {
    /** @type {Nodes} */
    const node = {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{type: 'text', value: 'alpha'}]
    }
    fromString(node)

    assert.deepEqual(node, {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: []
    })
  })
})
