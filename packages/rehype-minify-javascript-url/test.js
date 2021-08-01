import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-javascript-url', (t) => {
  /* eslint-disable no-script-url */
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('a', {id: 'foo', href: 'javascript:alert(false)'}, 'Hello')
        ])
      ),
    u('root', [h('a', {id: 'foo', href: 'javascript:alert(!1)'}, 'Hello')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('a', {href: 'javascript:alert(false'}, 'Hello')])),
    u('root', [h('a', {href: 'javascript:alert(false'}, 'Hello')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('img', {src: 'http://example.com/fav.ico'})])),
    u('root', [h('img', {src: 'http://example.com/fav.ico'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [{type: 'element', tagName: 'img', children: []}])),
    u('root', [{type: 'element', tagName: 'img', children: []}])
  )
  /* eslint-enable no-script-url */

  t.end()
})
