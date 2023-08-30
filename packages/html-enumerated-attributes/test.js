import assert from 'node:assert/strict'
import test from 'node:test'
import {enumeratedAttributes} from 'html-enumerated-attributes'
import {html, find} from 'property-information'

test('html-enumerated-attributes', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('html-enumerated-attributes')).sort(),
      ['enumeratedAttributes']
    )
  })

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
