import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {minifyWhitespace} from 'hast-util-minify-whitespace'

test('hast-util-minify-whitespace', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('hast-util-minify-whitespace')).sort(),
      ['minifyWhitespace']
    )
  })

  await t.test('should work', async function () {
    const tree = h('main', [
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
      h('p', [h('a', {href: 'example.com'}, ' baz'), '  ', h('em', ' qux')]),
      '  '
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
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
  })

  await t.test('should work on `head`', async function () {
    const tree = h('head', [
      '  ',
      h('meta', {itemProp: true}),
      '  ',
      h('noscript', [
        '  ',
        h('link', {rel: ['stylesheet'], href: 'index.css'}),
        '  '
      ])
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('head', [
        h('meta', {itemProp: true}),
        h('noscript', [h('link', {rel: ['stylesheet'], href: 'index.css'})])
      ])
    )
  })

  await t.test('should support `newlines`', async function () {
    const tree = h('main', [
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
      h('p', [h('a', {href: 'example.com'}, ' baz'), '  ', h('em', ' qux')]),
      '  '
    ])

    minifyWhitespace(tree, {newlines: true})

    assert.deepEqual(
      tree,
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
  })

  await t.test(
    'should trim whitespace around `<br>` elements',
    async function () {
      const tree = h('main', ['  a  ', h('br'), ' c '])

      minifyWhitespace(tree)

      assert.deepEqual(tree, h('main', ['a', h('br'), 'c']))
    }
  )

  await t.test('should trim whitespace in `<form>`s', async function () {
    const tree = h('form', [
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

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('form', [
        h('input', {list: 'a'}),
        h('datalist', {id: 'a'}, [h('option', 'b'), h('option', 'c')])
      ])
    )
  })

  await t.test(
    'should trim whitespace around `<object>` elements',
    async function () {
      const tree = h('section', [
        '  a  ',
        h('object', ['  b  ', h('p', '  c  '), '  d  ']),
        '  e  '
      ])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('section', ['a ', h('object', ['b', h('p', 'c'), 'd ']), ' e'])
      )
    }
  )

  await t.test('should work between phrasing elements (1)', async function () {
    const tree = h('main', [
      h('p', [
        h('strong', 'foo '),
        h('em', 'bar '),
        h('a', {href: 'example.com'}, ' baz '),
        h('em', ' qux ')
      ])
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('main', [
        h('p', [
          h('strong', 'foo '),
          h('em', 'bar '),
          h('a', {href: 'example.com'}, 'baz '),
          h('em', 'qux')
        ])
      ])
    )
  })

  await t.test('should work between phrasing elements (2)', async function () {
    const tree = h('main', [
      h('p', [' ', h('span', [' ', h('strong', ' '), ' ']), ' '])
    ])

    minifyWhitespace(tree)

    assert.deepEqual(tree, h('main', [h('p', [h('span', [h('strong')])])]))
  })

  await t.test('should work between phrasing elements (3)', async function () {
    const tree = h('main', [h('strong', 'a'), h('span', [h('span', ' '), 'b'])])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('main', [h('strong', 'a'), h('span', [h('span', ' '), 'b'])])
    )
  })

  await t.test(
    'should drop w/o content in flow elements (1)',
    async function () {
      const tree = h('main', '  ')

      minifyWhitespace(tree)

      assert.deepEqual(tree, h('main'))
    }
  )

  await t.test(
    'should drop w/o content in flow elements (2)',
    async function () {
      const tree = h('main', '\n ')

      minifyWhitespace(tree)

      assert.deepEqual(tree, h('main'))
    }
  )

  await t.test('should drop around flow elements (1)', async function () {
    const tree = h('main', ['  ', h('p'), '  ', h('p'), '  '])

    minifyWhitespace(tree)

    assert.deepEqual(tree, h('main', [h('p'), h('p')]))
  })

  await t.test('should drop around flow elements (2)', async function () {
    const tree = h('main', ['  ', h('div', ['  ', ' foo ', ' \n', ' bar '])])

    minifyWhitespace(tree)

    assert.deepEqual(tree, h('main', [h('div', ['foo ', 'bar'])]))
  })

  await t.test(
    'should drop deep at the end of phrasing (1)',
    async function () {
      const tree = h('main', [
        h('i', [
          h('span', 'foo '),
          h('a', {href: 'example.com'}, [h('span', 'bar ')])
        ])
      ])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [
          h('i', [
            h('span', 'foo '),
            h('a', {href: 'example.com'}, [h('span', 'bar')])
          ])
        ])
      )
    }
  )

  await t.test(
    'should drop deep at the end of phrasing (2)',
    async function () {
      const tree = h('main', [
        h('span', ['foo ', h('a', {href: 'example.com'}, 'bar'), ' baz'])
      ])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [
          h('span', ['foo ', h('a', {href: 'example.com'}, 'bar'), ' baz'])
        ])
      )
    }
  )

  await t.test(
    'should drop deep at the end of phrasing (2)',
    async function () {
      const tree = h('main', [
        h('p'),
        h('i', [h('span', 'foo ')]),
        h('i', [h('a', {href: 'example.com'}, [h('span', 'bar ')])])
      ])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [
          h('p'),
          h('i', [h('span', 'foo ')]),
          h('i', [h('a', {href: 'example.com'}, [h('span', 'bar')])])
        ])
      )
    }
  )

  await t.test('should drop a ton of complex whitespace', async function () {
    const tree = h(undefined, [
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

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
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
      const tree = h('p', [h('label', ' a '), ' ', h('input')])

      minifyWhitespace(tree)

      assert.deepEqual(tree, h('p', [h('label', 'a '), h('input')]))
    }
  )

  await t.test('should allow whitespace before an input', async function () {
    const tree = h('p', [h('label', 'a'), ' ', h('input')])

    minifyWhitespace(tree)

    assert.deepEqual(tree, h('p', [h('label', 'a'), ' ', h('input')]))
  })

  await t.test(
    'should allow whitespace before an empty button',
    async function () {
      const tree = h('p', [h('label', 'a'), ' ', h('button')])

      minifyWhitespace(tree)

      assert.deepEqual(tree, h('p', [h('label', 'a'), ' ', h('button')]))
    }
  )

  await t.test('should trim whitespace between blocks', async function () {
    const tree = h('main', [h('p', ' a '), ' b ', h('p', ' c ')])

    minifyWhitespace(tree)

    assert.deepEqual(tree, h('main', [h('p', 'a'), 'b', h('p', 'c')]))
  })

  await t.test('should trim whitespace in head', async function () {
    const tree = h(undefined, [
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

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
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
    const tree = h('p', [
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

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('p', [
        'a ',
        h('select', [
          h('optgroup', {label: 'b'}, [h('option', 'c'), h('option', 'd')])
        ]),
        ' e'
      ])
    )
  })

  await t.test('should trim whitespace around media', async function () {
    const tree = h('p', [
      '  a  ',
      h('img'),
      '  b  ',
      h('video'),
      '  c  ',
      h('audio'),
      '  d  '
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('p', ['a ', h('img'), ' b ', h('video'), ' c ', h('audio'), ' d'])
    )
  })

  await t.test('should trim whitespace inside media', async function () {
    const tree = h('p', [
      '  a  ',
      h('video', [h('track'), '  b  ', h('a', '  c  '), '  d  ']),
      '  e  '
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('p', ['a ', h('video', [h('track'), 'b ', h('a', 'c '), 'd ']), ' e'])
    )
  })

  await t.test(
    'should trim whitespace around comments (#1)',
    async function () {
      const tree = h('p', ['  a  ', {type: 'comment', value: '  b  '}, '  c  '])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('p', ['a ', {type: 'comment', value: '  b  '}, 'c'])
      )
    }
  )

  await t.test(
    'should trim whitespace around comments (#2)',
    async function () {
      const tree = h('main', [
        h('p', '  a  '),
        {type: 'comment', value: '  b  '},
        h('p', '  c  ')
      ])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [h('p', 'a'), {type: 'comment', value: '  b  '}, h('p', 'c')])
      )
    }
  )

  await t.test(
    'should trim whitespace around hidden elements',
    async function () {
      const tree = h('main', [
        h('p', '  a  '),
        '  ',
        h('x', {hidden: true}, '  b  '),
        '  ',
        h('p', '  c  '),
        '  ',
        h('p', ['  d  ', h('x', {hidden: true}, '  e  '), '  f  '])
      ])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [
          h('p', 'a'),
          h('x', {hidden: true}, 'b'),
          h('p', 'c'),
          h('p', ['d ', h('x', {hidden: true}, 'e '), 'f'])
        ])
      )
    }
  )

  await t.test(
    'should not trim whitespace around unknown nodes',
    async function () {
      const tree = h('main', [
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

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [
          h('p', 'a'),
          // @ts-expect-error: custom node.
          {type: 'x'},
          h('p', 'c'),
          // @ts-expect-error: custom node.
          h('p', ['d ', {type: 'x'}, ' f'])
        ])
      )
    }
  )

  await t.test(
    'should not trim whitespace around unknown nodes',
    async function () {
      const tree = h('main', [
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

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [
          h('p', 'a'),
          // @ts-expect-error: custom node.
          {type: 'x'},
          h('p', 'c'),
          // @ts-expect-error: custom node.
          h('p', ['d ', {type: 'x'}, ' f'])
        ])
      )
    }
  )

  await t.test('should not trim whitespace in `xmp`', async function () {
    const tree = h('main', [
      h('p', '  a  '),
      '  ',
      h('xmp', '  1 < 3  '),
      '  ',
      h('p', '  b  ')
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('main', [h('p', 'a'), h('xmp', '  1 < 3  '), h('p', 'b')])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    const tree = h('main', [
      h('p', '  a  '),
      '  ',
      h('listing', '  1 < 3  '),
      '  ',
      h('p', '  b  ')
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')])
    )
  })

  await t.test('should trim whitespace in a fragment', async function () {
    const tree = h(undefined, [h('p', '  a  '), '  ', h('p', '  b  ')])

    minifyWhitespace(tree)

    assert.deepEqual(tree, h(undefined, [h('p', 'a'), h('p', 'b')]))
  })

  await t.test('should not trim whitespace in `plaintext`', async function () {
    const tree = h(undefined, [
      h('p', '  a  '),
      '  ',
      h('plaintext', '  1 < 3  ')
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h(undefined, [h('p', 'a'), h('plaintext', '  1 < 3  ')])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    const tree = h(undefined, [
      h('main', [
        h('p', '  a  '),
        '  ',
        h('listing', '  1 < 3  '),
        '  ',
        h('p', '  b  ')
      ])
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h(undefined, [
        h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')])
      ])
    )
  })

  await t.test('should not trim whitespace in `listing`', async function () {
    const tree = h(undefined, [
      h('main', [
        h('p', '  a  '),
        '  ',
        h('listing', '  1 < 3  '),
        '  ',
        h('p', '  b  ')
      ])
    ])

    minifyWhitespace(tree)

    assert.deepEqual(
      tree,
      h(undefined, [
        h('main', [h('p', 'a'), h('listing', '  1 < 3  '), h('p', 'b')])
      ])
    )
  })

  await t.test(
    'should collapse but not trim whitespace in `nobr`',
    async function () {
      const tree = h('p', [
        '  ',
        h('nobr', '  Long   line   with   no   breaks  '),
        '  '
      ])

      minifyWhitespace(tree)

      assert.deepEqual(tree, h('p', [h('nobr', ' Long line with no breaks ')]))
    }
  )

  await t.test(
    'should not collapse or trim whitespace in `textarea`',
    async function () {
      const tree = h('p', ['  a  ', h('textarea', '  b  '), '  c  '])

      minifyWhitespace(tree)

      assert.deepEqual(tree, h('p', ['a ', h('textarea', '  b  '), ' c']))
    }
  )

  await t.test(
    'should not collapse or trim whitespace in `pre`',
    async function () {
      const tree = h('main', [
        h('p', '  a  '),
        '  ',
        h('pre', h('code', '  1 < 3  ')),
        '  ',
        h('p', '  b  ')
      ])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [h('p', 'a'), h('pre', h('code', '  1 < 3  ')), h('p', 'b')])
      )
    }
  )

  await t.test(
    'should not collapse or trim whitespace in `pre[wrap]`',
    async function () {
      const tree = h('main', [
        h('p', '  a  '),
        '  ',
        h('pre', {wrap: true}, h('code', '  1 < 3  ')),
        '  ',
        h('p', '  b  ')
      ])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [
          h('p', 'a'),
          h('pre', {wrap: true}, h('code', '  1 < 3  ')),
          h('p', 'b')
        ])
      )
    }
  )

  await t.test(
    'should collapse and trim whitespace in tables',
    async function () {
      const tree = h('main', [
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

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', [
          h('p', 'a'),
          h('table', [
            h('thead', [h('tr', [h('th', {noWrap: true}, ' b ')])]),
            h('tbody', [h('tr', [h('td', 'c')])])
          ]),
          h('p', 'd')
        ])
      )
    }
  )

  await t.test(
    'should collapse and trim whitespace in tables',
    async function () {
      const tree = h('main', [' \u00A0 ', h('p', '  a \u00A0 '), ' \u00A0 '])

      minifyWhitespace(tree)

      assert.deepEqual(
        tree,
        h('main', ['\u00A0', h('p', 'a \u00A0'), '\u00A0'])
      )
    }
  )

  await t.test('should not collapse whitespace in scripts', async function () {
    const tree = h('script', ' // a \n b ')

    minifyWhitespace(tree)

    assert.deepEqual(tree, h('script', ' // a \n b '))
  })
})
