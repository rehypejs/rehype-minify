'use strict'

var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')

var min = require('.')

test('rehype-minify-whitespace', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          '  ',
          h('p', [
            '  ',
            h('strong', 'foo'),
            '  ',
            h('em', 'bar'),
            '  ',
            h('meta', {itemProp: true}),
            '  '
          ]),
          '  ',
          h('p', [
            h('a', {href: 'example.com'}, ' baz'),
            '  ',
            h('em', ' qux')
          ]),
          '  '
        ])
      ),
    h('main', [
      h('p', [
        h('strong', 'foo'),
        ' ',
        h('em', 'bar'),
        ' ',
        h('meta', {itemProp: true})
      ]),
      h('p', [
        h('a', {href: 'example.com'}, 'baz'),
        h('em', ' qux')
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('head', [
          '  ',
          h('meta', {itemProp: true}),
          '  ',
          h('noscript', [
            '  ',
            h('link', {rel: ['stylesheet'], href: 'index.css'}),
            '  '
          ])
        ])
      ),
    h('head', [
      h('meta', {itemProp: true}),
      h('noscript', [h('link', {rel: ['stylesheet'], href: 'index.css'})])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min, {newlines: true})
      .runSync(
        h('main', [
          '  ',
          h('p', [
            '\n ',
            h('strong', 'foo'),
            '  ',
            h('em', 'bar'),
            ' \n',
            h('meta', {itemProp: true}),
            ' \n'
          ]),
          ' \n',
          h('p', [
            h('a', {href: 'example.com'}, ' baz'),
            '  ',
            h('em', ' qux')
          ]),
          '  '
        ])
      ),
    h('main', [
      h('p', [
        h('strong', 'foo'),
        ' ',
        h('em', 'bar'),
        '\n',
        h('meta', {itemProp: true})
      ]),
      h('p', [
        h('a', {href: 'example.com'}, 'baz'),
        h('em', ' qux')
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', [
            h('strong', ' foo '),
            h('em', 'bar '),
            h('a', {href: 'example.com'}, ' baz '),
            h('em', ' qux ')
          ])
        ])
      ),
    h('main', [
      h('p', [
        h('strong', 'foo '),
        h('em', 'bar'),
        h('a', {href: 'example.com'}, ' baz'),
        h('em', ' qux')
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', [
            ' foo ',
            h('strong', ' bar '),
            h('a', {href: 'example.com'}, ' baz '),
            ' qux. '
          ])
        ])
      ),
    h('main', [
      h('p', [
        'foo',
        h('strong', ' bar'),
        h('a', {href: 'example.com'}, ' baz'),
        ' qux.'
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', [
            h('span', ' foo: '),
            h('input', {type: 'button', value: 'baz'}),
          ])
        ])
      ),
    h('main', [
      h('p', [
        h('span', 'foo: '),
        h('input', {type: 'button', value: 'baz'}),
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min, {newlines: true})
      .runSync(
        h('main', [
          '  ',
        ])
      ),
    h('main')
  )

  t.deepEqual(
    rehype()
      .use(min, {newlines: true})
      .runSync(
        h('main', [
          h('p', [
            '\n ',
          ]),
        ])
      ),
    h('main', [
      h('p')
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          '  ',
          h('p'),
          '  ',
          h('p'),
          '  '
        ])
      ),
    h('main', [
      h('p'),
      h('p')
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          '  ',
          h('div', [
            '  ',
            ' foo ',
            ' \n',
            ' bar ',
          ]),
        ])
      ),
    h('main', [
      h('div', [
        'foo',
        ' bar',
      ])
    ])
  )

  // keep span spacing
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('span', [
            'foo ',
            h('a', {href: 'example.com'}, 'bar'),
            ' baz',
          ])
        ])
      ),
    h('main', [
      h('span', [
        'foo ',
        h('a', {href: 'example.com'}, 'bar'),
        ' baz',
      ])
    ])
  )

  // "optimise" span spacing
  // t.deepEqual(
  //   rehype()
  //     .use(min)
  //     .runSync(
  //       h('main', [
  //         h('span', [
  //           'foo ',
  //           h('a', {href: 'example.com'}, ' bar '),
  //           ' baz',
  //         ])
  //       ])
  //     ),
  //   h('main', [
  //     h('span', [
  //       'foo ',
  //       h('a', {href: 'example.com'}, 'bar'),
  //       ' baz',
  //     ])
  //   ])
  // )

  t.end()
})
