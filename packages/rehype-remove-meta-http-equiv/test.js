import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-remove-meta-http-equiv'

test('rehype-remove-meta-http-equiv', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-remove-meta-http-equiv')).sort(),
      ['default']
    )
  })

  await t.test('should overwrite existing `meta[charSet]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('head', [
              h('meta', {charSet: 'utf8'}),
              h('meta', {
                httpEquiv: ['content-type'],
                content: 'text/html; charset=chinese'
              })
            ])
          ])
        ),
      h(undefined, [h('head', [h('meta', {charSet: 'chinese'})])])
    )
  })

  await t.test('should inject new `meta[charSet]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('head', [
              h('meta', {
                httpEquiv: ['content-type'],
                content: 'text/html; charset=chinese'
              })
            ])
          ])
        ),
      h(undefined, [h('head', [h('meta', {charSet: 'chinese'})])])
    )
  })

  await t.test('should ignore outside of `head`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('html', [
              h('meta', {
                httpEquiv: ['content-type'],
                content: 'text/html; charset=chinese'
              })
            ])
          ])
        ),
      h(undefined, [
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
            h(undefined, [
              h('head', [
                h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
              ])
            ])
          ),
        h(undefined, [
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
            h(undefined, [
              h('html', [
                h('head', [
                  h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
                ])
              ])
            ])
          ),
        h(undefined, [h('html', {lang: 'en-US'}, [h('head', [])])])
      )
    }
  )

  await t.test('should overwrite existing `html[lang]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('html', {lang: 'en-GB'}, [
              h('head', [
                h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
              ])
            ])
          ])
        ),
      h(undefined, [h('html', {lang: 'en-US'}, [h('head', [])])])
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            {type: 'doctype'},
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
      h(undefined, [
        {type: 'doctype'},
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
