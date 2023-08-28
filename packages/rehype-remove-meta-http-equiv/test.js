import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-meta-http-equiv', async function (t) {
  await t.test('should overwrite existing `meta[charSet]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('head', [
              h('meta', {charSet: 'utf8'}),
              h('meta', {
                httpEquiv: ['content-type'],
                content: 'text/html; charset=chinese'
              })
            ])
          ])
        ),
      u('root', [h('head', [h('meta', {charSet: 'chinese'})])])
    )
  })

  await t.test('should inject new `meta[charSet]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('head', [
              h('meta', {
                httpEquiv: ['content-type'],
                content: 'text/html; charset=chinese'
              })
            ])
          ])
        ),
      u('root', [h('head', [h('meta', {charSet: 'chinese'})])])
    )
  })

  await t.test('should ignore outside of `head`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('html', [
              h('meta', {
                httpEquiv: ['content-type'],
                content: 'text/html; charset=chinese'
              })
            ])
          ])
        ),
      u('root', [
        h('html', [
          h('meta', {
            httpEquiv: ['content-type'],
            content: 'text/html; charset=chinese'
          })
        ])
      ])
    )
  })

  await t.test(
    'should ignore `content-language` w/o `html`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('head', [
                h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
              ])
            ])
          ),
        u('root', [
          h('head', [
            h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
          ])
        ])
      )
    }
  )

  await t.test(
    'should move `content-language` to `html[lang]`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('html', [
                h('head', [
                  h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
                ])
              ])
            ])
          ),
        u('root', [h('html', {lang: 'en-US'}, [h('head', [])])])
      )
    }
  )

  await t.test('should overwrite existing `html[lang]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('html', {lang: 'en-GB'}, [
              h('head', [
                h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
              ])
            ])
          ])
        ),
      u('root', [h('html', {lang: 'en-US'}, [h('head', [])])])
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            u('doctype', {name: 'html'}),
            h('html', {lang: 'en-GB'}, [
              h('head', [
                h('meta', {charSet: 'utf8'}),
                h(
                  'noscript',
                  h('link', {rel: ['stylesheet'], href: 'index.css'})
                ),
                h('meta', {
                  name: 'viewport',
                  content: 'width=device-width, initial-scale=1.0'
                }),
                h('meta', {
                  httpEquiv: ['X-UA-Compatible'],
                  content: 'IE=edge, chrome=1'
                }),
                h('meta', {
                  httpEquiv: ['content-type'],
                  content: 'text/html; charset=chinese'
                }),
                h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
              ]),
              h('body', h('p', 'Hello, world!'))
            ])
          ])
        ),
      u('root', [
        u('doctype', {name: 'html'}),
        h('html', {lang: 'en-US'}, [
          h('head', [
            h('meta', {charSet: 'chinese'}),
            h('noscript', h('link', {rel: ['stylesheet'], href: 'index.css'})),
            h('meta', {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1.0'
            }),
            h('meta', {
              httpEquiv: ['X-UA-Compatible'],
              content: 'IE=edge, chrome=1'
            })
          ]),
          h('body', h('p', 'Hello, world!'))
        ])
      ])
    )
  })
})
