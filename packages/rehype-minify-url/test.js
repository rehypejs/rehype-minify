import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-url', function (t) {
  t.throws(function () {
    rehype().use(min).freeze()
  }, /^Error: Missing absolute `from` in options$/)

  t.throws(function () {
    rehype().use(min, {from: '/'}).freeze()
  }, /^Error: Missing absolute `from` in options$/)

  t.throws(function () {
    rehype().use(min, {from: '/'}).freeze()
  }, /^Error: Missing absolute `from` in options$/)

  var options = {from: 'http://example.com/one/alpha/'}

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(h('a', {href: 'http://example.com/one/bravo/index.html'})),
    h('a', {href: '../bravo/'})
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(h('a', {href: 'http://example.com/two/charlie/index.html'})),
    h('a', {href: '/two/charlie/'})
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(h('a', {href: options.from})),
    h('a', {href: ''})
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(h('a', {href: options.from.replace(/http/, 'https')})),
    h('a', {href: options.from.replace(/http/, 'https')})
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(h('a', {href: 'http://google.com:80/alpha'})),
    h('a', {href: '//google.com/alpha'})
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(h('a', {href: '../../../../../../../../#anchor'})),
    h('a', {href: '/#anchor'})
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(h('a', {href: false, ping: ['../../foo', '../../bar']})),
    h('a', {href: false, ping: ['/foo', '/bar']})
  )

  t.deepEqual(
    rehype()
      .use(min, options)
      .runSync(h('a', {href: true})),
    h('a', {href: true})
  )

  t.end()
})
