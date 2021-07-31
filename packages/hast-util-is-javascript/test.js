import test from 'tape'
import u from 'unist-builder'
import h from 'hastscript'
import {isJavaScript} from './index.js'

test('hast-util-is-javascript', function (t) {
  t.ok(isJavaScript(h('script')), 'yes - for `script`')
  t.ok(
    isJavaScript(h('script', {src: 'index.js'})),
    'yes - for `script` with src'
  )
  t.ok(
    isJavaScript(h('script', {type: 'text/ecmascript'})),
    'yes - for `text/ecmascript` type'
  )
  t.ok(
    isJavaScript(h('script', {language: 'ecmascript'})),
    'yes - for `ecmascript` language'
  )
  t.ok(
    isJavaScript(h('script', {type: 'text/jscript'})),
    'yes - for `text/jscript` type'
  )
  t.ok(
    isJavaScript(h('script', {language: 'jscript'})),
    'yes - for `jscript` language'
  )
  t.ok(
    isJavaScript(h('script', {type: 'text/javascript1.5'})),
    'yes - for `text/javascript1.5` type'
  )
  t.ok(
    isJavaScript(h('script', {language: 'javascript1.5'})),
    'yes - for `javascript1.5` language'
  )

  t.notOk(isJavaScript(), 'no - for nothing')
  t.notOk(isJavaScript(u('root', [])), 'no - for other nodes')
  t.notOk(isJavaScript(h('p')), 'no - for other elements')
  t.notOk(isJavaScript(h('script', {type: true})), 'no - for non-string type')
  t.notOk(
    isJavaScript(h('script', {type: 'text/fooscript'})),
    'no - for other type'
  )
  t.ok(
    isJavaScript(h('script', {type: 'text/javascript', language: 'fooscript'})),
    'yes - for JS type with other language'
  )
  t.notOk(
    isJavaScript(h('script', {language: 'fooscript'})),
    'no - for other language'
  )
  t.notOk(
    isJavaScript(h('script', {language: true})),
    'no - for non-string language'
  )

  t.end()
})
