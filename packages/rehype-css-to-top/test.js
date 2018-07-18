'use strict'

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape')
var rehype = require('rehype')
var u = require('unist-builder')
var h = require('hastscript')
var min = require('.')

test('rehype-css-to-top', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('head'),
          h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
        ])
      ),
    u('root', [
      h('head', h('link', {rel: ['stylesheet'], href: 'index.css'})),
      h('body')
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('head'),
          h(
            'body',
            h('link', {
              rel: ['stylesheet'],
              type: 'text/foostyle',
              href: 'index.css'
            })
          )
        ])
      ),
    u('root', [
      h('head'),
      h(
        'body',
        h('link', {
          rel: ['stylesheet'],
          type: 'text/foostyle',
          href: 'index.css'
        })
      )
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))),
    h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
  )

  t.end()
})
