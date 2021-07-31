import test from 'tape'
import rehype from 'rehype'
import u from 'unist-builder'
import h from 'hastscript'
import min from './index.js'

test('rehype-prevent-favicon-request', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          u('doctype', {name: 'html'}),
          h('html', [h('head'), h('body')])
        ])
      ),
    u('root', [
      u('doctype', {name: 'html'}),
      h('html', [
        h(
          'head',
          h('link', {
            rel: ['shortcut', 'icon'],
            type: 'image/x-icon',
            href: 'data:image/x-icon;,'
          })
        ),
        h('body')
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          u('doctype', {name: 'html'}),
          h('html', [
            h('head', [
              h('link', {
                rel: ['shortcut', 'icon'],
                href: '/example.ico'
              })
            ])
          ])
        ])
      ),
    u('root', [
      u('doctype', {name: 'html'}),
      h('html', [
        h('head', [
          h('link', {
            rel: ['shortcut', 'icon'],
            href: '/example.ico'
          })
        ])
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          u('doctype', {name: 'html'}),
          h('html', [
            h('head', [
              h('link', {
                rel: ['icon'],
                href: '/example.ico'
              })
            ])
          ])
        ])
      ),
    u('root', [
      u('doctype', {name: 'html'}),
      h('html', [
        h('head', [
          h('link', {
            rel: ['icon'],
            href: '/example.ico'
          }),
          h('link', {
            rel: ['shortcut', 'icon'],
            type: 'image/x-icon',
            href: 'data:image/x-icon;,'
          })
        ])
      ])
    ])
  )

  t.deepEqual(rehype().use(min).runSync(u('root', [])), u('root', []))

  t.end()
})
