import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-concat-css-style', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('style', 'b {color: red}'), h('style', 'i {color: blue}')])
      ),
    u('root', [h('style', 'b {color: red}i {color: blue}')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('style', 'b {color: red}'),
          h('style', {type: 'text/foostyle'}, 'i {color: blue}')
        ])
      ),
    u('root', [
      h('style', 'b {color: red}'),
      h('style', {type: 'text/foostyle'}, 'i {color: blue}')
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('style', 'b {color: red}')])),
    u('root', [h('style', 'b {color: red}')])
  )

  t.end()
})
