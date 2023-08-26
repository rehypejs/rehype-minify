import test from 'tape'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {isBodyOkLink} from './index.js'

test('isBodyOkLink', (t) => {
  t.equal(
    isBodyOkLink(h('link', {itemProp: 'foo'})),
    true,
    'yes - for `link`s with `itemProp`'
  )

  t.equal(
    isBodyOkLink(h('link', {rel: ['prefetch'], href: '//example.com'})),
    true,
    'yes - for `link`s with `rel[prefetch]`'
  )

  t.equal(
    isBodyOkLink(h('link', {rel: ['stylesheet'], href: 'index.css'})),
    true,
    'yes - for `link`s with `rel[stylesheet]`'
  )

  t.equal(
    isBodyOkLink(h('link', {rel: ['pingback'], href: '//example.com'})),
    true,
    'yes - for `link`s with `rel[pingback]`'
  )

  t.equal(
    isBodyOkLink(h('link', {rel: ['author'], href: 'index.css'})),
    false,
    'no - for `link`s with other rel’s'
  )

  t.equal(
    isBodyOkLink(h('link', {rel: ['stylesheet', 'author'], href: 'index.css'})),
    false,
    'no - for `link`s with combined rel’s'
  )

  t.equal(
    isBodyOkLink(h('link')),
    false,
    'no - for `link`s without `rel` or `itemProp`'
  )

  t.equal(
    isBodyOkLink(u('element', {tagName: 'link', properties: {}}, [])),
    false,
    'no - for `link`s without `rel` or `itemProp` (2)'
  )

  t.equal(isBodyOkLink(h('p')), false, 'no - for non-links')

  t.equal(isBodyOkLink(u('text', 'foo')), false, 'no - for non-elements')
  t.end()
})
