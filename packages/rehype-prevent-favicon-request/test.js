import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-prevent-favicon-request', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            u('doctype', {name: 'html'}),
            h('html', [h('head'), h('body')])
          ])
        ),
      u('root', [
        u('doctype', {name: 'html'}),
        h('html', [
          h(
            'head',
            h('link', {
              rel: ['shortcut', 'icon'],
              type: 'image/x-icon',
              href: 'data:image/x-icon;,'
            })
          ),
          h('body')
        ])
      ])
    )
  })

  await t.test('should do nothing w/ existing favicon (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            u('doctype', {name: 'html'}),
            h('html', [
              h('head', [
                h('link', {
                  rel: ['shortcut', 'icon'],
                  href: '/example.ico'
                })
              ])
            ])
          ])
        ),
      u('root', [
        u('doctype', {name: 'html'}),
        h('html', [
          h('head', [
            h('link', {
              rel: ['shortcut', 'icon'],
              href: '/example.ico'
            })
          ])
        ])
      ])
    )
  })

  await t.test('should do nothing w/ existing favicon (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            u('doctype', {name: 'html'}),
            h('html', [
              h('head', [
                h('link', {
                  rel: ['icon'],
                  href: '/example.ico'
                })
              ])
            ])
          ])
        ),
      u('root', [
        u('doctype', {name: 'html'}),
        h('html', [
          h('head', [
            h('link', {
              rel: ['icon'],
              href: '/example.ico'
            }),
            h('link', {
              rel: ['shortcut', 'icon'],
              type: 'image/x-icon',
              href: 'data:image/x-icon;,'
            })
          ])
        ])
      ])
    )
  })

  await t.test('should do nothing without head', async function () {
    assert.deepEqual(rehype().use(min).runSync(u('root', [])), u('root', []))
  })
})
