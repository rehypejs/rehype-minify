import test from 'tape'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {isConditionalComment} from './index.js'

test('hast-util-is-conditional-comment', (t) => {
  const fixtures = [
    '[if IE]>…<![endif]',
    '[if IE 6]>…<![endif]',
    '[if IE 7]>…<![endif]',
    '[if IE 8]>…<![endif]',
    '[if IE 9]>…<![endif]',
    '[if gte IE 8]>…<![endif]',
    '[if lt IE 9]>…<![endif]',
    '[if lte IE 7]>…<![endif]',
    '[if gt IE 6]>…<![endif]',
    '[if !IE]>',
    '<![endif]'
  ]
  let index = -1

  while (++index < fixtures.length) {
    const d = fixtures[index]
    t.equal(
      isConditionalComment(u('comment', d)),
      true,
      'yes - <!--' + d + '-->'
    )
  }

  t.equal(
    // @ts-expect-error: incorrect node.
    isConditionalComment(u('comments', 'foo')),
    false,
    'no - for other comments'
  )
  t.equal(isConditionalComment(h('div')), false, 'no - for elements')
  t.equal(isConditionalComment(u('text', 'foo')), false, 'no - for texts')

  t.end()
})
