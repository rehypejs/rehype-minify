import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-enumerated-attribute', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('meta', {charSet: 'utf-8'})])),
    u('root', [h('meta', {charSet: 'utf8'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('meta', {charSet: 'x-mac-roman'})])),
    u('root', [h('meta', {charSet: 'mac'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('track', {kind: 'metadata', src: 'example.vtt'})])),
    u('root', [h('track', {kind: 'a', src: 'example.vtt'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('track', {kind: 'invalid'})])),
    u('root', [h('track', {kind: 'a'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('track', {kind: 'subtitles'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'track',
        properties: {kind: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('button', {type: 'submit'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'button',
        properties: {type: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('area', {shape: 'rect'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'area',
        properties: {shape: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('area', {shape: 'rectangle'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'area',
        properties: {shape: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('area', {shape: 'invalid'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'area',
        properties: {shape: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('div', {translate: 'invalid'})])),
    u('root', [h('div', {translate: 'invalid'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('div', {spellCheck: 'true'})])),
    u('root', [h('div', {spellCheck: ''})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('div', {spellCheck: 'false'})])),
    u('root', [h('div', {spellCheck: 'false'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('div', {spellCheck: 'invalid'})])),
    u('root', [h('div', {spellCheck: 'invalid'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('link', {crossOrigin: 'anonymous'})])),
    u('root', [h('link', {crossOrigin: ''})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('img', {loading: 'eager'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'img',
        properties: {loading: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('img', {loading: 'lazy'})])),
    u('root', [h('img', {loading: 'lazy'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('img', {loading: 'xxx'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'img',
        properties: {loading: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('img')])),
    u('root', [h('img')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('li', {type: 'xxx'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'li',
        properties: {type: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('a', {target: 'b'})])),
    u('root', [h('a', {target: 'b'})]),
    'should keep an unlisted `target`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('area', {target: '_blank'})])),
    u('root', [h('area', {target: '_blank'})]),
    'should keep `area[target="_blank"]`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('a', {target: '_self'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'a',
        properties: {target: null},
        children: []
      }
    ]),
    'should remove `[target="_self"]` on `base`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('form', {target: ''})])),
    u('root', [
      {
        type: 'element',
        tagName: 'form',
        properties: {target: null},
        children: []
      }
    ]),
    'should remove `[target=""]` on `form`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [{type: 'element', tagName: 'form', children: []}])),
    u('root', [{type: 'element', tagName: 'form', children: []}]),
    'should support an element w/o properties'
  )

  t.end()
})
