import test from 'tape'
import rehype from 'rehype'
import u from 'unist-builder'
import h from 'hastscript'
import min from './index.js'

test('rehype-concat-javascript', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('script', 'alert(1)'), h('script', 'alert(2)')])),
    u('root', [h('script', 'alert(1);alert(2)')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('script', 'alert(1);'), h('script', 'alert(2);')])),
    u('root', [h('script', 'alert(1);;alert(2);')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('script', 'alert(1)'),
          h('script', {type: 'text/fooscript'}, 'alert(2)')
        ])
      ),
    u('root', [
      h('script', 'alert(1)'),
      h('script', {type: 'text/fooscript'}, 'alert(2)')
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('script', 'alert(1)'),
          h('script', {src: 'foo'}),
          h('script', 'alert(2)')
        ])
      ),
    u('root', [h('script', 'alert(1);alert(2)'), h('script', {src: 'foo'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('script', 'alert(1)')])),
    u('root', [h('script', 'alert(1)')])
  )

  t.end()
})
