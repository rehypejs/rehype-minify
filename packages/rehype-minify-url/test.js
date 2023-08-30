import assert from 'node:assert/strict'
import {URL} from 'node:url'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-minify-url', async function (t) {
  await t.test('should throw w/o options', async function () {
    assert.throws(function () {
      rehype().use(min).processSync('')
    }, /^Error: Missing absolute `from` in options$/)
  })

  await t.test('should throw with relative `from`', async function () {
    assert.throws(function () {
      rehype().use(min, {from: '/'}).processSync('')
    }, /^Error: Missing absolute `from` in options$/)
  })

  const options = {from: 'http://example.com/one/alpha/'}

  await t.test(
    'should work w/ an absolute URL -> relative path',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, options)
          .runSync(
            h(undefined, [
              h('a', {href: 'http://example.com/one/bravo/index.html'})
            ])
          ),
        h(undefined, [h('a', {href: '../bravo/'})])
      )
    }
  )

  await t.test(
    'should work w/ an absolute URL -> absolute path',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, options)
          .runSync(
            h(undefined, [
              h('a', {href: 'http://example.com/two/charlie/index.html'})
            ])
          ),
        h(undefined, [h('a', {href: '/two/charlie/'})])
      )
    }
  )

  await t.test(
    'should work w/ an absolute URL -> empty string, if it’s equal to `from`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, options)
          .runSync(h(undefined, [h('a', {href: options.from})])),
        h(undefined, [h('a', {href: ''})])
      )
    }
  )

  await t.test('should work w/ https', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(
          h(undefined, [h('a', {href: options.from.replace(/http/, 'https')})])
        ),
      h(undefined, [h('a', {href: options.from.replace(/http/, 'https')})])
    )
  })

  await t.test('should drop port `80`', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(h(undefined, [h('a', {href: 'http://google.com:80/alpha'})])),
      h(undefined, [h('a', {href: '//google.com/alpha'})])
    )
  })

  await t.test('should understand when the top is reached', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(
          h(undefined, [h('a', {href: '../../../../../../../../#anchor'})])
        ),
      h(undefined, [h('a', {href: '/#anchor'})])
    )
  })

  await t.test('should support lists', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(
          h(undefined, [
            h('a', {href: false, ping: ['../../foo', '../../bar']})
          ])
        ),
      h(undefined, [h('a', {href: false, ping: ['/foo', '/bar']})])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(h(undefined, [h('a', {href: true})])),
      h(undefined, [h('a', {href: true})])
    )
  })

  await t.test(
    'should keep `href` on `link[rel=canonical]`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, options)
          .runSync(
            h(undefined, [
              {
                type: 'element',
                tagName: 'link',
                properties: {href: options.from, rel: ['canonical']},
                children: []
              }
            ])
          ),
        h(undefined, [
          {
            type: 'element',
            tagName: 'link',
            properties: {href: options.from, rel: ['canonical']},
            children: []
          }
        ])
      )
    }
  )

  await t.test(
    'should support `data.meta.{origin,pathname}`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(function () {
            return function (_, file) {
              const url = new URL(options.from)
              // From: <https://github.com/rehypejs/rehype-meta#configorigin>
              file.data.meta = {origin: url.origin, pathname: url.pathname}
            }
          })
          .use(min)
          .runSync(
            h(undefined, [
              h('a', {href: 'http://example.com/one/bravo/index.html'})
            ])
          ),
        h(undefined, [h('a', {href: '../bravo/'})])
      )
    }
  )
})
