import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-javascript-to-bottom', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('head', [
            h('script', {src: 'index.js'}),
            h('script', 'alert(1);'),
            h('script', {type: 'fooscript', src: 'index.js'})
          ]),
          h('body', [])
        ])
      ),
    u('root', [
      h('head', [h('script', {type: 'fooscript', src: 'index.js'})]),
      h('body', [h('script', {src: 'index.js'}), h('script', 'alert(1);')])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('head'),
          h(
            'body',
            h('link', {
              rel: ['stylesheet'],
              type: 'text/foostyle',
              href: 'index.css'
            })
          )
        ])
      ),
    u('root', [
      h('head'),
      h(
        'body',
        h('link', {
          rel: ['stylesheet'],
          type: 'text/foostyle',
          href: 'index.css'
        })
      )
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))),
    h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
  )

  function ignoreFoo(node) {
    return !/foo.js/.test(node.properties.src)
  }

  t.deepEqual(
    rehype()
      .use(min, {filter: ignoreFoo})
      .runSync(
        u('root', [
          h('head', [
            h('script', {src: 'index.js'}),
            h('script', {src: 'foo.js'})
          ]),
          h('body', [])
        ])
      ),
    u('root', [
      h('head', [h('script', {src: 'foo.js'})]),
      h('body', [h('script', {src: 'index.js'})])
    ])
  )

  t.end()
})
