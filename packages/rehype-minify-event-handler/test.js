import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-event-handler', (t) => {
  /* eslint-disable no-script-url */
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('h1', {onClick: 'javascript:alert(false)'}, 'Hello')])
      ),
    u('root', [h('h1', {onClick: 'alert(!1)'}, 'Hello')])
  )
  /* eslint-enable no-script-url */

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('button', {onClick: 'return false'}, 'Click me')])),
    u('root', [h('button', {onClick: 'return!1'}, 'Click me')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('button', {id: 'foo', onClick: 'alert('}, 'Click me')])
      ),
    u('root', [h('button', {id: 'foo', onClick: 'alert('}, 'Click me')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('button', {onCut: true}, 'Click me')])),
    u('root', [h('button', {onCut: true}, 'Click me')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [{type: 'element', tagName: 'button', children: []}])),
    u('root', [{type: 'element', tagName: 'button', children: []}])
  )

  t.end()
})
