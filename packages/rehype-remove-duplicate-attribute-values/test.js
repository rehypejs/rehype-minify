import test from 'tape'
import rehype from 'rehype'
import h from 'hastscript'
import min from './index.js'

test('rehype-remove-duplicate-attribute-values', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('i', {className: ['foo', 'foo'], autoComplete: ['on', 'on']})),
    h('i', {className: ['foo'], autoComplete: ['on', 'on']})
  )

  t.end()
})
