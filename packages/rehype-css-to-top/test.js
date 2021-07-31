import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-css-to-top', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('head'),
          h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
        ])
      ),
    u('root', [
      h('head', h('link', {rel: ['stylesheet'], href: 'index.css'})),
      h('body')
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

  t.end()
})
