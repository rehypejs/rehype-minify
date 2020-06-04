'use strict'

var test = require('tape')
var rehype = require('rehype')
var u = require('unist-builder')
var h = require('hastscript')

var min = require('.')

test('rehype-minify-whitespace', function (t) {
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
        h('meta', {itemProp: true})
      ]),
      h('p', [h('a', {href: 'example.com'}, 'baz'), ' ', h('em', 'qux')])
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
            ' \n',
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
        '\n',
        h('em', 'bar'),
        h('meta', {itemProp: true})
      ]),
      h('p', [h('a', {href: 'example.com'}, 'baz'), ' ', h('em', 'qux')])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', [
            h('strong', 'foo '),
            h('em', 'bar '),
            h('a', {href: 'example.com'}, ' baz '),
            h('em', ' qux ')
          ])
        ])
      ),
    h('main', [
      h('p', [
        h('strong', 'foo '),
        h('em', 'bar '),
        h('a', {href: 'example.com'}, 'baz '),
        h('em', 'qux')
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [h('p', [' ', h('span', [' ', h('strong', ' '), ' ']), ' '])])
      ),
    h('main', [h('p', [h('span', [h('strong')])])])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('main', [h('strong', 'a'), h('span', [h('span', ' '), 'b'])])),
    h('main', [h('strong', 'a'), h('span', [h('span', ' '), 'b'])])
  )

  t.deepEqual(rehype().use(min).runSync(h('main', '  ')), h('main'))

  t.deepEqual(rehype().use(min).runSync(h('main', '\n ')), h('main'))

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('main', ['  ', h('p'), '  ', h('p'), '  '])),
    h('main', [h('p'), h('p')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('main', ['  ', h('div', ['  ', ' foo ', ' \n', ' bar '])])),
    h('main', [h('div', ['foo ', 'bar'])])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('i', [
            h('span', 'foo '),
            h('a', {href: 'example.com'}, [h('span', 'bar ')])
          ])
        ])
      ),
    h('main', [
      h('i', [
        h('span', 'foo '),
        h('a', {href: 'example.com'}, [h('span', 'bar')])
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('span', ['foo ', h('a', {href: 'example.com'}, 'bar'), ' baz'])
        ])
      ),
    h('main', [
      h('span', ['foo ', h('a', {href: 'example.com'}, 'bar'), ' baz'])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p'),
          [
            h('i', [h('span', 'foo ')]),
            h('i', [h('a', {href: 'example.com'}, [h('span', 'bar ')])])
          ]
        ])
      ),
    h('main', [
      h('p'),
      [
        h('i', [h('span', 'foo ')]),
        h('i', [h('a', {href: 'example.com'}, [h('span', 'bar')])])
      ]
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          u('doctype', {name: 'html'}),
          u('text', '\n'),
          h('html', [
            '\n  ',
            h('head', [
              '\n    ',
              h('meta', {charSet: 'utf8'}),
              '\n    ',
              h('title', ' a '),
              '\n    ',
              h('link', {rel: ['stylesheet']}),
              '\n  '
            ]),
            '\n  ',
            h('body', [
              '\n    ',
              h('h1', ['\n      bar  bar\n    ']),
              '\n    ',
              h('p', [
                '\n      ',
                h('strong', ['\n        foo\n      ']),
                '\n      bar\n      ',
                h('em', ['\n        baz\n      ']),
                '\n    '
              ]),
              '\n  '
            ])
          ])
        ])
      ),
    u('root', [
      u('doctype', {name: 'html'}),
      h('html', [
        h('head', [
          h('meta', {charSet: 'utf8'}),
          h('title', 'a'),
          h('link', {rel: ['stylesheet']})
        ]),
        h('body', [
          h('h1', ['bar bar']),
          h('p', [h('strong', ['foo ']), 'bar ', h('em', ['baz'])])
        ])
      ])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('p', [h('label', ' a '), ' ', h('input')])),
    h('p', [h('label', 'a '), h('input')]),
    'should prefer whitespace in earlier elements'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('p', [h('label', 'a'), ' ', h('input')])),
    h('p', [h('label', 'a'), ' ', h('input')]),
    'should allow whitespace before an input'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('p', [h('label', 'a'), ' ', h('button')])),
    h('p', [h('label', 'a'), ' ', h('button')]),
    'should allow whitespace before an empty button'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('main', [h('p', ' a '), ' b ', h('p', ' c ')])),
    h('main', [h('p', 'a'), 'b', h('p', 'c')]),
    'should trim whitespace between blocks'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('head', [
          '  ',
          h('meta', {charSet: 'utf8'}),
          '  ',
          h('title', '  a  '),
          '  ',
          h('link'),
          '  ',
          h('script', '  b  '),
          '  ',
          h('meta'),
          '  ',
          h('script', '  c  '),
          '  ',
          h('style', '  d  '),
          '  '
        ])
      ),
    h('head', [
      h('meta', {charSet: 'utf8'}),
      h('title', 'a'),
      h('link'),
      h('script', 'b'),
      h('meta'),
      h('script', 'c'),
      h('style', 'd')
    ]),
    'should trim whitespace in head'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('p', [
          '  a  ',
          h('select', [
            '  ',
            h('optgroup', {label: 'b'}, [
              '  ',
              h('option', '  c  '),
              '  ',
              h('option', '  d  '),
              '  '
            ]),
            '  '
          ]),
          '  e  '
        ])
      ),
    h('p', [
      'a ',
      h('select', [
        h('optgroup', {label: 'b'}, [h('option', 'c'), h('option', 'd')])
      ]),
      ' e'
    ]),
    'should trim whitespace in selects'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('p', [
          '  a  ',
          h('img'),
          '  b  ',
          h('video'),
          '  c  ',
          h('audio'),
          '  d  '
        ])
      ),
    h('p', ['a ', h('img'), ' b ', h('video'), ' c ', h('audio'), ' d']),
    'should trim whitespace around media'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('p', [
          '  a  ',
          h('video', [h('track'), '  b  ', h('a', '  c  '), '  d  ']),
          '  e  '
        ])
      ),
    h('p', ['a ', h('video', [h('track'), 'b ', h('a', 'c '), 'd ']), ' e']),
    'should trim whitespace inside media'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('p', ['  a  ', u('comment', '  b  '), '  c  '])),
    h('p', ['a ', u('comment', '  b  '), 'c']),
    'should trim whitespace around comments (#1)'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [h('p', '  a  '), u('comment', '  b  '), h('p', '  c  ')])
      ),
    h('main', [h('p', 'a'), u('comment', '  b  '), h('p', 'c')]),
    'should trim whitespace around comments (#2)'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          h('x', {hidden: true}, '  b  '),
          '  ',
          h('p', '  c  '),
          '  ',
          h('p', ['  d  ', h('x', {hidden: true}, '  e  '), '  f  '])
        ])
      ),
    h('main', [
      h('p', 'a'),
      h('x', {hidden: true}, 'b'),
      h('p', 'c'),
      h('p', ['d ', h('x', {hidden: true}, 'e '), 'f'])
    ]),
    'should trim whitespace around hidden elements'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          u('x'),
          '  ',
          h('p', '  c  '),
          '  ',
          h('p', ['  d  ', u('x'), '  f  '])
        ])
      ),
    h('main', [h('p', 'a'), u('x'), h('p', 'c'), h('p', ['d ', u('x'), ' f'])]),
    'should not trim whitespace around unknown nodes'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          u('x'),
          '  ',
          h('p', '  c  '),
          '  ',
          h('p', ['  d  ', u('x'), '  f  '])
        ])
      ),
    h('main', [h('p', 'a'), u('x'), h('p', 'c'), h('p', ['d ', u('x'), ' f'])]),
    'should not trim whitespace around unknown nodes'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          h('xmp', '  1 < 3  '),
          '  ',
          h('p', '  b  ')
        ])
      ),
    h('main', [h('p', 'a'), h('xmp', '  1 < 3  '), h('p', 'b')]),
    'should not trim whitespace in `xmp`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          h('listing', '  1 < 3  '),
          '  ',
          h('p', '  b  ')
        ])
      ),
    h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')]),
    'should not trim whitespace in `listing`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('p', '  a  '), u('text', '  '), h('p', '  b  ')])),
    u('root', [h('p', 'a'), h('p', 'b')]),
    'should trim whitespace in a fragment'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('p', '  a  '),
          u('text', '  '),
          h('plaintext', '  1 < 3  ')
        ])
      ),
    u('root', [h('p', 'a'), h('plaintext', '  1 < 3  ')]),
    'should not trim whitespace in `plaintext`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          h('listing', '  1 < 3  '),
          '  ',
          h('p', '  b  ')
        ])
      ),
    h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')]),
    'should not trim whitespace in `listing`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          h('listing', '  1 < 3  '),
          '  ',
          h('p', '  b  ')
        ])
      ),
    h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')]),
    'should not trim whitespace in `listing`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('p', ['  ', h('nobr', '  Long   line   with   no   breaks  '), '  '])
      ),
    h('p', [h('nobr', ' Long line with no breaks ')]),
    'should collapse but not trim whitespace in `nobr`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('p', ['  a  ', h('textarea', '  b  '), '  c  '])),
    h('p', ['a ', h('textarea', '  b  '), ' c']),
    'should not collapse or trim whitespace in `textarea`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          h('pre', h('code', '  1 < 3  ')),
          '  ',
          h('p', '  b  ')
        ])
      ),
    h('main', [h('p', 'a'), h('pre', h('code', '  1 < 3  ')), h('p', 'b')]),
    'should not collapse or trim whitespace in `pre`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          h('p', '  a  '),
          '  ',
          h('pre', {wrap: true}, h('code', '  1 < 3  ')),
          '  ',
          h('p', '  b  ')
        ])
      ),
    h('main', [
      h('p', 'a'),
      h('pre', {wrap: true}, h('code', '  1 < 3  ')),
      h('p', 'b')
    ]),
    'should not collapse or trim whitespace in `pre[wrap]`'
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          '  ',
          h('p', '  a  '),
          '  ',
          h('table', [
            '  ',
            h('thead', [
              '  ',
              h('tr', ['  ', h('th', {noWrap: true}, '  b  '), '  ']),
              '  '
            ]),
            '  ',
            h('tbody', ['  ', h('tr', ['  ', h('td', '  c  '), '  ']), '  '])
          ]),
          '  ',
          h('p', '  d  '),
          '  '
        ])
      ),
    h('main', [
      h('p', 'a'),
      h('table', [
        h('thead', [h('tr', [h('th', {noWrap: true}, ' b ')])]),
        h('tbody', [h('tr', [h('td', 'c')])])
      ]),
      h('p', 'd')
    ]),
    'should collapse and trim whitespace in tables'
  )

  t.end()
})
