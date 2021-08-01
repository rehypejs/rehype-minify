import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-url', (t) => {
  t.throws(() => {
    rehype().use(min).freeze()
  }, /^Error: Missing absolute `from` in options$/)

  t.throws(() => {
    rehype().use(min, {from: '/'}).freeze()
  }, /^Error: Missing absolute `from` in options$/)

  t.throws(() => {
    rehype().use(min, {from: '/'}).freeze()
  }, /^Error: Missing absolute `from` in options$/)

  const options = {from: 'http://example.com/one/alpha/'}

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(
        u('root', [h('a', {href: 'http://example.com/one/bravo/index.html'})])
      ),
    u('root', [h('a', {href: '../bravo/'})])
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(
        u('root', [h('a', {href: 'http://example.com/two/charlie/index.html'})])
      ),
    u('root', [h('a', {href: '/two/charlie/'})])
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(u('root', [h('a', {href: options.from})])),
    u('root', [h('a', {href: ''})])
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(
        u('root', [h('a', {href: options.from.replace(/http/, 'https')})])
      ),
    u('root', [h('a', {href: options.from.replace(/http/, 'https')})])
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(u('root', [h('a', {href: 'http://google.com:80/alpha'})])),
    u('root', [h('a', {href: '//google.com/alpha'})])
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(u('root', [h('a', {href: '../../../../../../../../#anchor'})])),
    u('root', [h('a', {href: '/#anchor'})])
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(
        u('root', [h('a', {href: false, ping: ['../../foo', '../../bar']})])
      ),
    u('root', [h('a', {href: false, ping: ['/foo', '/bar']})])
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(u('root', [h('a', {href: true})])),
    u('root', [h('a', {href: true})])
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(u('root', [{type: 'element', tagName: 'a', children: []}])),
    u('root', [{type: 'element', tagName: 'a', children: []}])
  )

  t.end()
})
