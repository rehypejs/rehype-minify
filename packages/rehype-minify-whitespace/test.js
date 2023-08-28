import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-whitespace', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
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
          ])
        ),
      u('root', [
        h('main', [
          h('p', [
            h('strong', 'foo'),
            ' ',
            h('em', 'bar'),
            h('meta', {itemProp: true})
          ]),
          h('p', [h('a', {href: 'example.com'}, 'baz'), ' ', h('em', 'qux')])
        ])
      ])
    )
  })

  await t.test('should work on `head`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
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
          ])
        ),
      u('root', [
        h('head', [
          h('meta', {itemProp: true}),
          h('noscript', [h('link', {rel: ['stylesheet'], href: 'index.css'})])
        ])
      ])
    )
  })

  await t.test('should support `newlines`', async function () {
    assert.deepEqual(
      rehype()
        .use(min, {newlines: true})
        .runSync(
          u('root', [
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
          ])
        ),
      u('root', [
        h('main', [
          h('p', [
            h('strong', 'foo'),
            '\n',
            h('em', 'bar'),
            h('meta', {itemProp: true})
          ]),
          h('p', [h('a', {href: 'example.com'}, 'baz'), ' ', h('em', 'qux')])
        ])
      ])
    )
  })

  await t.test(
    'should trim whitespace around `<br>` elements',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min, {newlines: true})
          .runSync(u('root', [h('main', ['  a  ', h('br'), ' c '])])),
        u('root', [h('main', ['a', h('br'), 'c'])])
      )
    }
  )

  await t.test('should trim whitespace in `<form>`s', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('form', [
              '  ',
              h('input', {list: 'a'}),
              '  ',
              h('datalist', {id: 'a'}, [
                '  ',
                h('option', 'b'),
                '  ',
                h('option', 'c'),
                '  '
              ]),
              '  '
            ])
          ])
        ),
      u('root', [
        h('form', [
          h('input', {list: 'a'}),
          h('datalist', {id: 'a'}, [h('option', 'b'), h('option', 'c')])
        ])
      ])
    )
  })

  await t.test(
    'should trim whitespace around `<object>` elements',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('section', [
                '  a  ',
                h('object', ['  b  ', h('p', '  c  '), '  d  ']),
                '  e  '
              ])
            ])
          ),
        u('root', [
          h('section', ['a ', h('object', ['b', h('p', 'c'), 'd ']), ' e'])
        ])
      )
    }
  )

  await t.test('should work between phrasing elements (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('main', [
              h('p', [
                h('strong', 'foo '),
                h('em', 'bar '),
                h('a', {href: 'example.com'}, ' baz '),
                h('em', ' qux ')
              ])
            ])
          ])
        ),
      u('root', [
        h('main', [
          h('p', [
            h('strong', 'foo '),
            h('em', 'bar '),
            h('a', {href: 'example.com'}, 'baz '),
            h('em', 'qux')
          ])
        ])
      ])
    )
  })

  await t.test('should work between phrasing elements (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('main', [
              h('p', [' ', h('span', [' ', h('strong', ' '), ' ']), ' '])
            ])
          ])
        ),
      u('root', [h('main', [h('p', [h('span', [h('strong')])])])])
    )
  })

  await t.test('should work between phrasing elements (3)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('main', [h('strong', 'a'), h('span', [h('span', ' '), 'b'])])
          ])
        ),
      u('root', [
        h('main', [h('strong', 'a'), h('span', [h('span', ' '), 'b'])])
      ])
    )
  })

  await t.test(
    'should drop w/o content in flow elements (1)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('main', '  ')])),
        u('root', [h('main')])
      )
    }
  )

  await t.test(
    'should drop w/o content in flow elements (2)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('main', '\n ')])),
        u('root', [h('main')])
      )
    }
  )

  await t.test('should drop around flow elements (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('main', ['  ', h('p'), '  ', h('p'), '  '])])),
      u('root', [h('main', [h('p'), h('p')])])
    )
  })

  await t.test('should drop around flow elements (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('main', ['  ', h('div', ['  ', ' foo ', ' \n', ' bar '])])
          ])
        ),
      u('root', [h('main', [h('div', ['foo ', 'bar'])])])
    )
  })

  await t.test(
    'should drop deep at the end of phrasing (1)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('i', [
                  h('span', 'foo '),
                  h('a', {href: 'example.com'}, [h('span', 'bar ')])
                ])
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('i', [
              h('span', 'foo '),
              h('a', {href: 'example.com'}, [h('span', 'bar')])
            ])
          ])
        ])
      )
    }
  )

  await t.test(
    'should drop deep at the end of phrasing (2)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('span', [
                  'foo ',
                  h('a', {href: 'example.com'}, 'bar'),
                  ' baz'
                ])
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('span', ['foo ', h('a', {href: 'example.com'}, 'bar'), ' baz'])
          ])
        ])
      )
    }
  )

  await t.test(
    'should drop deep at the end of phrasing (2)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('p'),
                h('i', [h('span', 'foo ')]),
                h('i', [h('a', {href: 'example.com'}, [h('span', 'bar ')])])
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('p'),
            h('i', [h('span', 'foo ')]),
            h('i', [h('a', {href: 'example.com'}, [h('span', 'bar')])])
          ])
        ])
      )
    }
  )

  await t.test('should drop a ton of complex whitespace', async function () {
    assert.deepEqual(
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
  })

  await t.test(
    'should prefer whitespace in earlier elements',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('p', [h('label', ' a '), ' ', h('input')])])),
        u('root', [h('p', [h('label', 'a '), h('input')])])
      )
    }
  )

  await t.test('should allow whitespace before an input', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('p', [h('label', 'a'), ' ', h('input')])])),
      u('root', [h('p', [h('label', 'a'), ' ', h('input')])])
    )
  })

  await t.test(
    'should allow whitespace before an empty button',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('p', [h('label', 'a'), ' ', h('button')])])),
        u('root', [h('p', [h('label', 'a'), ' ', h('button')])])
      )
    }
  )

  await t.test('should trim whitespace between blocks', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('main', [h('p', ' a '), ' b ', h('p', ' c ')])])),
      u('root', [h('main', [h('p', 'a'), 'b', h('p', 'c')])])
    )
  })

  await t.test('should trim whitespace in head', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
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
          ])
        ),
      u('root', [
        h('head', [
          h('meta', {charSet: 'utf8'}),
          h('title', 'a'),
          h('link'),
          h('script', '  b  '),
          h('meta'),
          h('script', '  c  '),
          h('style', '  d  ')
        ])
      ])
    )
  })

  await t.test('should trim whitespace in selects', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
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
          ])
        ),
      u('root', [
        h('p', [
          'a ',
          h('select', [
            h('optgroup', {label: 'b'}, [h('option', 'c'), h('option', 'd')])
          ]),
          ' e'
        ])
      ])
    )
  })

  await t.test('should trim whitespace around media', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('p', [
              '  a  ',
              h('img'),
              '  b  ',
              h('video'),
              '  c  ',
              h('audio'),
              '  d  '
            ])
          ])
        ),
      u('root', [
        h('p', ['a ', h('img'), ' b ', h('video'), ' c ', h('audio'), ' d'])
      ])
    )
  })

  await t.test('should trim whitespace inside media', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('p', [
              '  a  ',
              h('video', [h('track'), '  b  ', h('a', '  c  '), '  d  ']),
              '  e  '
            ])
          ])
        ),
      u('root', [
        h('p', ['a ', h('video', [h('track'), 'b ', h('a', 'c '), 'd ']), ' e'])
      ])
    )
  })

  await t.test(
    'should trim whitespace around comments (#1)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [h('p', ['  a  ', u('comment', '  b  '), '  c  '])])
          ),
        u('root', [h('p', ['a ', u('comment', '  b  '), 'c'])])
      )
    }
  )

  await t.test(
    'should trim whitespace around comments (#2)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('p', '  a  '),
                u('comment', '  b  '),
                h('p', '  c  ')
              ])
            ])
          ),
        u('root', [
          h('main', [h('p', 'a'), u('comment', '  b  '), h('p', 'c')])
        ])
      )
    }
  )

  await t.test(
    'should trim whitespace around hidden elements',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('p', '  a  '),
                '  ',
                h('x', {hidden: true}, '  b  '),
                '  ',
                h('p', '  c  '),
                '  ',
                h('p', ['  d  ', h('x', {hidden: true}, '  e  '), '  f  '])
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('p', 'a'),
            h('x', {hidden: true}, 'b'),
            h('p', 'c'),
            h('p', ['d ', h('x', {hidden: true}, 'e '), 'f'])
          ])
        ])
      )
    }
  )

  await t.test(
    'should not trim whitespace around unknown nodes',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('p', '  a  '),
                '  ',
                // @ts-expect-error: custom node.
                u('x'),
                '  ',
                h('p', '  c  '),
                '  ',
                // @ts-expect-error: custom node.
                h('p', ['  d  ', u('x'), '  f  '])
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('p', 'a'),
            // @ts-expect-error: custom node.
            u('x'),
            h('p', 'c'),
            // @ts-expect-error: custom node.
            h('p', ['d ', u('x'), ' f'])
          ])
        ])
      )
    }
  )

  await t.test(
    'should not trim whitespace around unknown nodes',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('p', '  a  '),
                '  ',
                // @ts-expect-error: custom node.
                u('x'),
                '  ',
                h('p', '  c  '),
                '  ',
                // @ts-expect-error: custom node.
                h('p', ['  d  ', u('x'), '  f  '])
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('p', 'a'),
            // @ts-expect-error: custom node.
            u('x'),
            h('p', 'c'),
            // @ts-expect-error: custom node.
            h('p', ['d ', u('x'), ' f'])
          ])
        ])
      )
    }
  )

  await t.test('should not trim whitespace in `xmp`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('main', [
              h('p', '  a  '),
              '  ',
              h('xmp', '  1 < 3  '),
              '  ',
              h('p', '  b  ')
            ])
          ])
        ),
      u('root', [h('main', [h('p', 'a'), h('xmp', '  1 < 3  '), h('p', 'b')])])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('main', [
              h('p', '  a  '),
              '  ',
              h('listing', '  1 < 3  '),
              '  ',
              h('p', '  b  ')
            ])
          ])
        ),
      u('root', [
        h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')])
      ])
    )
  })

  await t.test('should trim whitespace in a fragment', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('p', '  a  '), u('text', '  '), h('p', '  b  ')])
        ),
      u('root', [h('p', 'a'), h('p', 'b')])
    )
  })

  await t.test('should not trim whitespace in `plaintext`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('p', '  a  '),
            u('text', '  '),
            h('plaintext', '  1 < 3  ')
          ])
        ),
      u('root', [h('p', 'a'), h('plaintext', '  1 < 3  ')])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('main', [
              h('p', '  a  '),
              '  ',
              h('listing', '  1 < 3  '),
              '  ',
              h('p', '  b  ')
            ])
          ])
        ),
      u('root', [
        h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')])
      ])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('main', [
              h('p', '  a  '),
              '  ',
              h('listing', '  1 < 3  '),
              '  ',
              h('p', '  b  ')
            ])
          ])
        ),
      u('root', [
        h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')])
      ])
    )
  })

  await t.test(
    'should collapse but not trim whitespace in `nobr`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('p', [
                '  ',
                h('nobr', '  Long   line   with   no   breaks  '),
                '  '
              ])
            ])
          ),
        u('root', [h('p', [h('nobr', ' Long line with no breaks ')])])
      )
    }
  )

  await t.test(
    'should not collapse or trim whitespace in `textarea`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [h('p', ['  a  ', h('textarea', '  b  '), '  c  '])])
          ),
        u('root', [h('p', ['a ', h('textarea', '  b  '), ' c'])])
      )
    }
  )

  await t.test(
    'should not collapse or trim whitespace in `pre`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('p', '  a  '),
                '  ',
                h('pre', h('code', '  1 < 3  ')),
                '  ',
                h('p', '  b  ')
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('p', 'a'),
            h('pre', h('code', '  1 < 3  ')),
            h('p', 'b')
          ])
        ])
      )
    }
  )

  await t.test(
    'should not collapse or trim whitespace in `pre[wrap]`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [
                h('p', '  a  '),
                '  ',
                h('pre', {wrap: true}, h('code', '  1 < 3  ')),
                '  ',
                h('p', '  b  ')
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('p', 'a'),
            h('pre', {wrap: true}, h('code', '  1 < 3  ')),
            h('p', 'b')
          ])
        ])
      )
    }
  )

  await t.test(
    'should collapse and trim whitespace in tables',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
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
                  h('tbody', [
                    '  ',
                    h('tr', ['  ', h('td', '  c  '), '  ']),
                    '  '
                  ])
                ]),
                '  ',
                h('p', '  d  '),
                '  '
              ])
            ])
          ),
        u('root', [
          h('main', [
            h('p', 'a'),
            h('table', [
              h('thead', [h('tr', [h('th', {noWrap: true}, ' b ')])]),
              h('tbody', [h('tr', [h('td', 'c')])])
            ]),
            h('p', 'd')
          ])
        ])
      )
    }
  )

  await t.test(
    'should collapse and trim whitespace in tables',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [
              h('main', [' \u00A0 ', h('p', '  a \u00A0 '), ' \u00A0 '])
            ])
          ),
        u('root', [h('main', ['\u00A0', h('p', 'a \u00A0'), '\u00A0'])])
      )
    }
  )

  await t.test('should not collapse whitespace in scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('script', ' // a \n b ')])),
      u('root', [h('script', ' // a \n b ')])
    )
  })
})
