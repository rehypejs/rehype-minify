import assert from 'node:assert/strict'
import {URL} from 'node:url'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-url', async function (t) {
  await t.test('should throw w/o options', async function () {
    assert.throws(() => {
      rehype().use(min).processSync('')
    }, /^Error: Missing absolute `from` in options$/)
  })

  await t.test('should throw with relative `from`', async function () {
    assert.throws(() => {
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
            u('root', [
              h('a', {href: 'http://example.com/one/bravo/index.html'})
            ])
          ),
        u('root', [h('a', {href: '../bravo/'})])
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
            u('root', [
              h('a', {href: 'http://example.com/two/charlie/index.html'})
            ])
          ),
        u('root', [h('a', {href: '/two/charlie/'})])
      )
    }
  )

  await t.test(
    'should work w/ an absolute URL -> empty string, if it’s equal to `from`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, options)
          .runSync(u('root', [h('a', {href: options.from})])),
        u('root', [h('a', {href: ''})])
      )
    }
  )

  await t.test('should work w/ https', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(
          u('root', [h('a', {href: options.from.replace(/http/, 'https')})])
        ),
      u('root', [h('a', {href: options.from.replace(/http/, 'https')})])
    )
  })

  await t.test('should drop port `80`', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(u('root', [h('a', {href: 'http://google.com:80/alpha'})])),
      u('root', [h('a', {href: '//google.com/alpha'})])
    )
  })

  await t.test('should understand when the top is reached', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(
          u('root', [h('a', {href: '../../../../../../../../#anchor'})])
        ),
      u('root', [h('a', {href: '/#anchor'})])
    )
  })

  await t.test('should support lists', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(
          u('root', [h('a', {href: false, ping: ['../../foo', '../../bar']})])
        ),
      u('root', [h('a', {href: false, ping: ['/foo', '/bar']})])
    )
  })

  await t.test('should ignore non-strings', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(u('root', [h('a', {href: true})])),
      u('root', [h('a', {href: true})])
    )
  })

  // To do: remove?
  await t.test('should ignore w/o properties', async function () {
    assert.deepEqual(
      rehype()
        .use(min, options)
        .runSync(
          u('root', [
            {type: 'element', tagName: 'a', properties: {}, children: []}
          ])
        ),
      u('root', [{type: 'element', tagName: 'a', properties: {}, children: []}])
    )
  })

  await t.test(
    'should keep `href` on `link[rel=canonical]`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, options)
          .runSync(
            u('root', [
              {
                type: 'element',
                tagName: 'link',
                properties: {href: options.from, rel: ['canonical']},
                children: []
              }
            ])
          ),
        u('root', [
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
          .use(() => (_, file) => {
            const url = new URL(options.from)
            // To do: include types to check this?
            file.data.meta = {origin: url.origin, pathname: url.pathname}
          })
          .use(min)
          .runSync(
            u('root', [
              h('a', {href: 'http://example.com/one/bravo/index.html'})
            ])
          ),
        u('root', [h('a', {href: '../bravo/'})])
      )
    }
  )
})
