'use strict'

/* eslint-disable import/no-extraneous-dependencies */
var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')
/* eslint-enable import/no-extraneous-dependencies */

var min = require('.')

test('rehype-minify-enumerated-attribute', function(t) {
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

  t.end()
})
