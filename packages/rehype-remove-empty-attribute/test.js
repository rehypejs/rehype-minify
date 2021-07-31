import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-duplicate-attribute-values', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('label', {htmlFor: '', id: '', allowTransparency: ''})),
    {
      type: 'element',
      tagName: 'label',
      properties: {
        allowTransparency: '',
        htmlFor: null,
        id: null
      },
      children: []
    }
  )

  t.end()
})
