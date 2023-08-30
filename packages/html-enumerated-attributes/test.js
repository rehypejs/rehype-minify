import assert from 'node:assert/strict'
import test from 'node:test'
import {html, find} from 'property-information'
import {enumeratedAttributes} from './index.js'

test('html-enumerated-attributes', async function (t) {
  await t.test('should be cased correctly', async function () {
    /** @type {string} */
    let key

    for (key in enumeratedAttributes) {
      if (Object.hasOwn(enumeratedAttributes, key)) {
        assert.equal(find(html, key).attribute, key)
      }
    }
  })
})
