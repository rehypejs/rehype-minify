import test from 'tape'
import rehype from 'rehype'
import u from 'unist-builder'
import min from './index.js'

test('rehype-minify-doctype', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('doctype', {
          name: 'HTML',
          public: '-//W3C//DTD HTML 4.01//EN',
          system: 'http://www.w3.org/TR/html4/strict.dtd'
        })
      ),
    u('doctype', {name: 'HTML', public: null, system: null})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [u('doctype', {name: 'html'})])),
    u('root', [u('doctype', {name: 'html'})])
  )

  t.end()
})
