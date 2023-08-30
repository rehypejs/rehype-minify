import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-minify-whitespace', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
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
      h(undefined, [
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
          h(undefined, [
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
      h(undefined, [
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
          h(undefined, [
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
      h(undefined, [
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
          .runSync(h(undefined, [h('main', ['  a  ', h('br'), ' c '])])),
        h(undefined, [h('main', ['a', h('br'), 'c'])])
      )
    }
  )

  await t.test('should trim whitespace in `<form>`s', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
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
      h(undefined, [
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
            h(undefined, [
              h('section', [
                '  a  ',
                h('object', ['  b  ', h('p', '  c  '), '  d  ']),
                '  e  '
              ])
            ])
          ),
        h(undefined, [
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
          h(undefined, [
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
      h(undefined, [
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
          h(undefined, [
            h('main', [
              h('p', [' ', h('span', [' ', h('strong', ' '), ' ']), ' '])
            ])
          ])
        ),
      h(undefined, [h('main', [h('p', [h('span', [h('strong')])])])])
    )
  })

  await t.test('should work between phrasing elements (3)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('main', [h('strong', 'a'), h('span', [h('span', ' '), 'b'])])
          ])
        ),
      h(undefined, [
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
          .runSync(h(undefined, [h('main', '  ')])),
        h(undefined, [h('main')])
      )
    }
  )

  await t.test(
    'should drop w/o content in flow elements (2)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(h(undefined, [h('main', '\n ')])),
        h(undefined, [h('main')])
      )
    }
  )

  await t.test('should drop around flow elements (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('main', ['  ', h('p'), '  ', h('p'), '  '])])),
      h(undefined, [h('main', [h('p'), h('p')])])
    )
  })

  await t.test('should drop around flow elements (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('main', ['  ', h('div', ['  ', ' foo ', ' \n', ' bar '])])
          ])
        ),
      h(undefined, [h('main', [h('div', ['foo ', 'bar'])])])
    )
  })

  await t.test(
    'should drop deep at the end of phrasing (1)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            h(undefined, [
              h('main', [
                h('i', [
                  h('span', 'foo '),
                  h('a', {href: 'example.com'}, [h('span', 'bar ')])
                ])
              ])
            ])
          ),
        h(undefined, [
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
            h(undefined, [
              h('main', [
                h('span', [
                  'foo ',
                  h('a', {href: 'example.com'}, 'bar'),
                  ' baz'
                ])
              ])
            ])
          ),
        h(undefined, [
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
            h(undefined, [
              h('main', [
                h('p'),
                h('i', [h('span', 'foo ')]),
                h('i', [h('a', {href: 'example.com'}, [h('span', 'bar ')])])
              ])
            ])
          ),
        h(undefined, [
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
          h(undefined, [
            {type: 'doctype'},
            {type: 'text', value: '\n'},
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
      h(undefined, [
        {type: 'doctype'},
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
          .runSync(
            h(undefined, [h('p', [h('label', ' a '), ' ', h('input')])])
          ),
        h(undefined, [h('p', [h('label', 'a '), h('input')])])
      )
    }
  )

  await t.test('should allow whitespace before an input', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('p', [h('label', 'a'), ' ', h('input')])])),
      h(undefined, [h('p', [h('label', 'a'), ' ', h('input')])])
    )
  })

  await t.test(
    'should allow whitespace before an empty button',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(h(undefined, [h('p', [h('label', 'a'), ' ', h('button')])])),
        h(undefined, [h('p', [h('label', 'a'), ' ', h('button')])])
      )
    }
  )

  await t.test('should trim whitespace between blocks', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('main', [h('p', ' a '), ' b ', h('p', ' c ')])])
        ),
      h(undefined, [h('main', [h('p', 'a'), 'b', h('p', 'c')])])
    )
  })

  await t.test('should trim whitespace in head', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
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
      h(undefined, [
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
          h(undefined, [
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
      h(undefined, [
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
          h(undefined, [
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
      h(undefined, [
        h('p', ['a ', h('img'), ' b ', h('video'), ' c ', h('audio'), ' d'])
      ])
    )
  })

  await t.test('should trim whitespace inside media', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('p', [
              '  a  ',
              h('video', [h('track'), '  b  ', h('a', '  c  '), '  d  ']),
              '  e  '
            ])
          ])
        ),
      h(undefined, [
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
            h(undefined, [
              h('p', ['  a  ', {type: 'comment', value: '  b  '}, '  c  '])
            ])
          ),
        h(undefined, [h('p', ['a ', {type: 'comment', value: '  b  '}, 'c'])])
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
            h(undefined, [
              h('main', [
                h('p', '  a  '),
                {type: 'comment', value: '  b  '},
                h('p', '  c  ')
              ])
            ])
          ),
        h(undefined, [
          h('main', [
            h('p', 'a'),
            {type: 'comment', value: '  b  '},
            h('p', 'c')
          ])
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
            h(undefined, [
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
        h(undefined, [
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
            h(undefined, [
              h('main', [
                h('p', '  a  '),
                '  ',
                // @ts-expect-error: custom node.
                {type: 'x'},
                '  ',
                h('p', '  c  '),
                '  ',
                // @ts-expect-error: custom node.
                h('p', ['  d  ', {type: 'x'}, '  f  '])
              ])
            ])
          ),
        h(undefined, [
          h('main', [
            h('p', 'a'),
            // @ts-expect-error: custom node.
            {type: 'x'},
            h('p', 'c'),
            // @ts-expect-error: custom node.
            h('p', ['d ', {type: 'x'}, ' f'])
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
            h(undefined, [
              h('main', [
                h('p', '  a  '),
                '  ',
                // @ts-expect-error: custom node.
                {type: 'x'},
                '  ',
                h('p', '  c  '),
                '  ',
                // @ts-expect-error: custom node.
                h('p', ['  d  ', {type: 'x'}, '  f  '])
              ])
            ])
          ),
        h(undefined, [
          h('main', [
            h('p', 'a'),
            // @ts-expect-error: custom node.
            {type: 'x'},
            h('p', 'c'),
            // @ts-expect-error: custom node.
            h('p', ['d ', {type: 'x'}, ' f'])
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
          h(undefined, [
            h('main', [
              h('p', '  a  '),
              '  ',
              h('xmp', '  1 < 3  '),
              '  ',
              h('p', '  b  ')
            ])
          ])
        ),
      h(undefined, [
        h('main', [h('p', 'a'), h('xmp', '  1 < 3  '), h('p', 'b')])
      ])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('main', [
              h('p', '  a  '),
              '  ',
              h('listing', '  1 < 3  '),
              '  ',
              h('p', '  b  ')
            ])
          ])
        ),
      h(undefined, [
        h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')])
      ])
    )
  })

  await t.test('should trim whitespace in a fragment', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('p', '  a  '), '  ', h('p', '  b  ')])),
      h(undefined, [h('p', 'a'), h('p', 'b')])
    )
  })

  await t.test('should not trim whitespace in `plaintext`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('p', '  a  '), '  ', h('plaintext', '  1 < 3  ')])
        ),
      h(undefined, [h('p', 'a'), h('plaintext', '  1 < 3  ')])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('main', [
              h('p', '  a  '),
              '  ',
              h('listing', '  1 < 3  '),
              '  ',
              h('p', '  b  ')
            ])
          ])
        ),
      h(undefined, [
        h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')])
      ])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('main', [
              h('p', '  a  '),
              '  ',
              h('listing', '  1 < 3  '),
              '  ',
              h('p', '  b  ')
            ])
          ])
        ),
      h(undefined, [
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
            h(undefined, [
              h('p', [
                '  ',
                h('nobr', '  Long   line   with   no   breaks  '),
                '  '
              ])
            ])
          ),
        h(undefined, [h('p', [h('nobr', ' Long line with no breaks ')])])
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
            h(undefined, [h('p', ['  a  ', h('textarea', '  b  '), '  c  '])])
          ),
        h(undefined, [h('p', ['a ', h('textarea', '  b  '), ' c'])])
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
            h(undefined, [
              h('main', [
                h('p', '  a  '),
                '  ',
                h('pre', h('code', '  1 < 3  ')),
                '  ',
                h('p', '  b  ')
              ])
            ])
          ),
        h(undefined, [
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
            h(undefined, [
              h('main', [
                h('p', '  a  '),
                '  ',
                h('pre', {wrap: true}, h('code', '  1 < 3  ')),
                '  ',
                h('p', '  b  ')
              ])
            ])
          ),
        h(undefined, [
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
            h(undefined, [
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
        h(undefined, [
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
            h(undefined, [
              h('main', [' \u00A0 ', h('p', '  a \u00A0 '), ' \u00A0 '])
            ])
          ),
        h(undefined, [h('main', ['\u00A0', h('p', 'a \u00A0'), '\u00A0'])])
      )
    }
  )

  await t.test('should not collapse whitespace in scripts', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('script', ' // a \n b ')])),
      h(undefined, [h('script', ' // a \n b ')])
    )
  })
})
