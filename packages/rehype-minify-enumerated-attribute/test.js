'use strict'

var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')

var min = require('.')

test('rehype-minify-enumerated-attribute', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {charSet: 'utf-8'})),
    h('meta', {charSet: 'utf8'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {charSet: 'x-mac-roman'})),
    h('meta', {charSet: 'mac'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('track', {kind: 'metadata', src: 'example.vtt'})),
    h('track', {kind: 'a', src: 'example.vtt'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('track', {kind: 'invalid'})),
    h('track', {kind: 'a'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('track', {kind: 'subtitles'})),
    {
      type: 'element',
      tagName: 'track',
      properties: {kind: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('button', {type: 'submit'})),
    {
      type: 'element',
      tagName: 'button',
      properties: {type: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('area', {shape: 'rect'})),
    {
      type: 'element',
      tagName: 'area',
      properties: {shape: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('area', {shape: 'rectangle'})),
    {
      type: 'element',
      tagName: 'area',
      properties: {shape: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('area', {shape: 'invalid'})),
    {
      type: 'element',
      tagName: 'area',
      properties: {shape: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('div', {translate: 'invalid'})),
    h('div', {translate: 'invalid'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('div', {spellCheck: 'true'})),
    h('div', {spellCheck: ''})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('div', {spellCheck: 'false'})),
    h('div', {spellCheck: 'false'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('div', {spellCheck: 'invalid'})),
    h('div', {spellCheck: 'invalid'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('link', {crossOrigin: 'anonymous'})),
    h('link', {crossOrigin: ''})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('img', {loading: 'eager'})),
    {
      type: 'element',
      tagName: 'img',
      properties: {loading: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('img', {loading: 'lazy'})),
    h('img', {loading: 'lazy'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('img', {loading: 'xxx'})),
    {
      type: 'element',
      tagName: 'img',
      properties: {loading: null},
      children: []
    }
  )

  t.deepEqual(rehype().use(min).runSync(h('img')), h('img'))

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('li', {type: 'xxx'})),
    {
      type: 'element',
      tagName: 'li',
      properties: {type: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('a', {target: 'b'})),
    h('a', {target: 'b'}),
    'should keep an unlisted `target`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('area', {target: '_blank'})),
    h('area', {target: '_blank'}),
    'should keep `area[target="_blank"]`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('a', {target: '_self'})),
    {
      type: 'element',
      tagName: 'a',
      properties: {target: null},
      children: []
    },
    'should remove `[target="_self"]` on `base`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('form', {target: ''})),
    {
      type: 'element',
      tagName: 'form',
      properties: {target: null},
      children: []
    },
    'should remove `[target=""]` on `form`'
  )

  t.end()
})
