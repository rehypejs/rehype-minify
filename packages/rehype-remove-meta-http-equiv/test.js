import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-meta-http-equiv', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('head', [
          h('meta', {charSet: 'utf8'}),
          h('meta', {
            httpEquiv: ['content-type'],
            content: 'text/html; charset=chinese'
          })
        ])
      ),
    h('head', [h('meta', {charSet: 'chinese'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('head', [
          h('meta', {
            httpEquiv: ['content-type'],
            content: 'text/html; charset=chinese'
          })
        ])
      ),
    h('head', [h('meta', {charSet: 'chinese'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('html', [
          h('meta', {
            httpEquiv: ['content-type'],
            content: 'text/html; charset=chinese'
          })
        ])
      ),
    h('html', [
      h('meta', {
        httpEquiv: ['content-type'],
        content: 'text/html; charset=chinese'
      })
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('head', [
          h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
        ])
      ),
    h('head', [h('meta', {httpEquiv: ['content-language'], content: 'en-US'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('html', [
          h('head', [
            h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
          ])
        ])
      ),
    h('html', {lang: 'en-US'}, [h('head', [])])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('html', {lang: 'en-GB'}, [
          h('head', [
            h('meta', {httpEquiv: ['content-language'], content: 'en-US'})
          ])
        ])
      ),
    h('html', {lang: 'en-US'}, [h('head', [])])
  )

  t.deepEqual(
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

  t.end()
})
