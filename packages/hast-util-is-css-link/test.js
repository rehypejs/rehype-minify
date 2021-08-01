import test from 'tape'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {isCssLink} from './index.js'

test('hast-util-is-css-link', (t) => {
  t.equal(
    isCssLink(h('link', {rel: ['stylesheet']})),
    true,
    'yes - for `link` with `[rel=stylesheet]` and no `[type]`'
  )

  t.equal(
    isCssLink(h('link', {rel: ['stylesheet', 'author']})),
    true,
    'yes - for `link` with multiple `rel`’s, including `stylesheet`, and no `[type]`'
  )

  t.equal(
    isCssLink(h('link', {rel: ['stylesheet'], type: 'text/css'})),
    true,
    'yes - for `link` with `[rel=stylesheet]` and `[type=text/css]`'
  )

  t.equal(
    isCssLink(h('link', {rel: ['stylesheet', 'author'], type: 'text/css'})),
    true,
    'yes - for `link` with multiple `rel`’s, including `stylesheet`, and `[type=text/css]`'
  )

  t.equal(
    isCssLink(h('link', {rel: ['stylesheet'], type: 'text/foo'})),
    false,
    'no - for `link` with `[rel=stylesheet]`, but a type other than `text/css`'
  )

  t.equal(
    isCssLink(h('link', {rel: ['author']})),
    false,
    'no - for `link`s with other rel’s'
  )

  t.equal(
    isCssLink(h('link', {rel: ['author'], type: 'text/css'})),
    false,
    'no - for `link`s with other rel’s (2)'
  )

  t.equal(isCssLink(h('link')), false, 'no - for `link`s without `rel`')

  t.equal(
    isCssLink(h('link', {rel: null})),
    false,
    'no - for `link`s without `rel`'
  )

  t.equal(
    isCssLink(u('element', {tagName: 'link'}, [])),
    false,
    'no - for `link`s without `rel`'
  )

  t.equal(isCssLink(h('p')), false, 'no - for non-links')

  t.equal(isCssLink(u('text', 'foo')), false, 'no - for non-elements')
  t.end()
})
