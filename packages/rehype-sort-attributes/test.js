import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import min from 'rehype-sort-attributes'

test('rehype-sort-attributes', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-sort-attributes')).sort(),
      ['default']
    )
  })

  await t.test('should work', async function () {
    assert.equal(
      rehype()
        .use(min)
        .data('settings', {fragment: true})
        .processSync(
          [
            '<a id="alpha" class="bravo" href="#charlie"></a>',
            '<a class="delta echo" href="#foxtrot"></a>',
            '<a hidden class="golf" href="#hotel"></a>',
            '<a title="india" hidden href="#juliett"></a>',
            '<img srcset="kilo.jpg" src="lima.jpg"></a>'
          ].join('\n')
        )
        .toString(),
      [
        '<a href="#charlie" class="bravo" id="alpha"></a>',
        '<a href="#foxtrot" class="delta echo"></a>',
        '<a href="#hotel" class="golf" hidden></a>',
        '<a href="#juliett" hidden title="india"></a>',
        '<img src="lima.jpg" srcset="kilo.jpg">'
      ].join('\n')
    )
  })
})
