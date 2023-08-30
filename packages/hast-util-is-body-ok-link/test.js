import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {isBodyOkLink} from './index.js'

test('isBodyOkLink', async function (t) {
  await t.test('should be yes for `link`s with `itemProp`', async function () {
    assert.equal(isBodyOkLink(h('link', {itemProp: 'foo'})), true)
  })

  await t.test(
    'should be yes for `link`s with `rel[prefetch]`',
    async function () {
      assert.equal(
        isBodyOkLink(h('link', {rel: ['prefetch'], href: '//example.com'})),
        true
      )
    }
  )

  await t.test(
    'should be yes for `link`s with `rel[stylesheet]`',
    async function () {
      assert.equal(
        isBodyOkLink(h('link', {rel: ['stylesheet'], href: 'index.css'})),
        true
      )
    }
  )

  await t.test(
    'should be yes for `link`s with `rel[pingback]`',
    async function () {
      assert.equal(
        isBodyOkLink(h('link', {rel: ['pingback'], href: '//example.com'})),
        true
      )
    }
  )

  await t.test('should be no for `link`s with other rel’s', async function () {
    assert.equal(
      isBodyOkLink(h('link', {rel: ['author'], href: 'index.css'})),
      false
    )
  })

  await t.test(
    'should be no for `link`s with combined rel’s',
    async function () {
      assert.equal(
        isBodyOkLink(
          h('link', {rel: ['stylesheet', 'author'], href: 'index.css'})
        ),
        false
      )
    }
  )

  await t.test(
    'should be no for `link`s without `rel` or `itemProp`',
    async function () {
      assert.equal(isBodyOkLink(h('link')), false)
    }
  )

  await t.test('should be no for non-links', async function () {
    assert.equal(isBodyOkLink(h('p')), false)
  })

  await t.test('should be no for non-elements', async function () {
    assert.equal(isBodyOkLink({type: 'text', value: 'foo'}), false)
  })
})
