import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-event-handler', function (t) {
  /* eslint-disable no-script-url */
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('h1', {onClick: 'javascript:alert(false)'}, 'Hello')),
    h('h1', {onClick: 'alert(!1)'}, 'Hello')
  )
  /* eslint-enable no-script-url */

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('button', {onClick: 'return false'}, 'Click me')),
    h('button', {onClick: 'return!1'}, 'Click me')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('button', {id: 'foo', onClick: 'alert('}, 'Click me')),
    h('button', {id: 'foo', onClick: 'alert('}, 'Click me')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('button', {onCut: true}, 'Click me')),
    h('button', {onCut: true}, 'Click me')
  )

  t.end()
})
