import test from 'tape'
import u from 'unist-builder'
import h from 'hastscript'
import {isCssStyle} from './index.js'

test('hast-util-is-css-style', function (t) {
  t.equal(isCssStyle(h('style')), true, 'yes - a `style` node')
  t.equal(
    isCssStyle(h('style', {type: null})),
    true,
    'yes - `style` without `type`'
  )
  t.equal(
    isCssStyle(h('style', {type: 'text/css'})),
    true,
    'yes - `style` with `[type=text/css]`'
  )
  t.equal(
    isCssStyle(h('style', {type: 'TEXT/CSS'})),
    true,
    'yes - `style` with `[type=TEXT/CSS]`'
  )
  t.equal(
    isCssStyle(h('style', {type: 'TeXt/CsS'})),
    true,
    'yes - `style` with `[type=TeXt/CsS]`'
  )
  t.equal(
    isCssStyle(h('style', {type: ' text/css '})),
    true,
    'yes - `style` with `[type= text/css ]`'
  )
  t.equal(
    isCssStyle(u('element', {tagName: 'style'})),
    true,
    'yes - without properties'
  )

  t.equal(
    isCssStyle(h('style', {type: 'text/foo'})),
    false,
    'no - `style` with `[type=text/foo]`'
  )
  t.equal(isCssStyle(h('div')), false, 'no - other elements')
  t.equal(isCssStyle(u('element', {tagName: 'p'})), false, 'no - other nodes')
  t.equal(isCssStyle(u('text', 'foo')), false, 'no - other nodes')
  t.equal(isCssStyle(), false, 'no - nothing')

  t.end()
})
