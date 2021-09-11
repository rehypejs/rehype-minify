import test from 'tape'
import {html, find} from 'property-information'
import {enumeratedAttributes} from './index.js'

const own = {}.hasOwnProperty

test('html-enumerated-attributes', (t) => {
  /** @type {string} */
  let key

  for (key in enumeratedAttributes) {
    if (own.call(enumeratedAttributes, key)) {
      t.equal(
        find(html, key).attribute,
        key,
        'should match html casing (`' + key + '`)'
      )
    }
  }

  t.end()
})
