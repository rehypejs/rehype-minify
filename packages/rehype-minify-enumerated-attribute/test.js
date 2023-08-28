/**
 * @typedef {import('rehype-stringify').Options} Options
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

// To do: get them from preset?
/**
 * @type {Options}
 */
const settings = {
  characterReferences: {
    omitOptionalSemicolons: true,
    useShortestReferences: true
  },
  quoteSmart: true,
  preferUnquoted: true,
  omitOptionalTags: true,
  bogusComments: true,
  collapseEmptyAttributes: true,
  closeEmptyElements: true,
  tightSelfClosing: true,
  tightCommaSeparatedLists: true,
  tightAttributes: true,
  tightDoctype: true,
  allowParseErrors: true
}

test('rehype-minify-enumerated-attribute', async function (t) {
  await t.test('should work on `meta[charSet]` (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('meta', {charSet: 'utf-8'})])),
      u('root', [h('meta', {charSet: 'utf8'})])
    )
  })

  await t.test('should work on `meta[charSet]` (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('meta', {charSet: 'x-mac-roman'})])),
      u('root', [h('meta', {charSet: 'mac'})])
    )
  })

  await t.test(
    'should work on `track[kind]`, by using the invalid value default',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(
            u('root', [h('track', {kind: 'metadata', src: 'example.vtt'})])
          ),
        u('root', [h('track', {kind: 'a', src: 'example.vtt'})])
      )
    }
  )

  await t.test(
    'should work on `track[kind]`, by using the invalid value default when invalid',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('track', {kind: 'invalid'})])),
        u('root', [h('track', {kind: 'a'})])
      )
    }
  )

  await t.test(
    'should work on `track[kind]`, by using the missing value default',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('track', {kind: 'subtitles'})])),
        u('root', [
          {
            type: 'element',
            tagName: 'track',
            properties: {kind: null},
            children: []
          }
        ])
      )
    }
  )

  await t.test(
    'should work on `button[type]`, by using the missing value default',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('button', {type: 'submit'})])),
        u('root', [
          {
            type: 'element',
            tagName: 'button',
            properties: {type: null},
            children: []
          }
        ])
      )
    }
  )

  await t.test(
    'should work on `area[shape]`, by using the missing value default',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('area', {shape: 'rect'})])),
        u('root', [
          {
            type: 'element',
            tagName: 'area',
            properties: {shape: null},
            children: []
          }
        ])
      )
    }
  )

  await t.test(
    'should work on `area[shape]`, by using the missing value default (legacy name)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('area', {shape: 'rectangle'})])),
        u('root', [
          {
            type: 'element',
            tagName: 'area',
            properties: {shape: null},
            children: []
          }
        ])
      )
    }
  )

  await t.test(
    'should work on `area[shape]`, by using the missing value default for an invalid value',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('area', {shape: 'invalid'})])),
        u('root', [
          {
            type: 'element',
            tagName: 'area',
            properties: {shape: null},
            children: []
          }
        ])
      )
    }
  )

  await t.test(
    'should keep invalid values on `[translate]`',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('div', {translate: 'invalid'})])),
        u('root', [h('div', {translate: 'invalid'})])
      )
    }
  )

  await t.test('should work on `[spellCheck]` (`true`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('div', {spellCheck: 'true'})])),
      u('root', [h('div', {spellCheck: ''})])
    )
  })

  await t.test('should work on `[spellCheck]` (`false`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('div', {spellCheck: 'false'})])),
      u('root', [h('div', {spellCheck: 'false'})])
    )
  })

  await t.test('should work on `[spellCheck]` (invalid)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('div', {spellCheck: 'invalid'})])),
      u('root', [h('div', {spellCheck: 'invalid'})])
    )
  })

  await t.test(
    'should work on `[crossOrigin]` (`anonymous`)',
    async function () {
      assert.deepEqual(
        rehype()
          .use(min)
          .runSync(u('root', [h('link', {crossOrigin: 'anonymous'})])),
        u('root', [h('link', {crossOrigin: ''})])
      )
    }
  )

  await t.test('should work on `[loading]` (`eager`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('img', {loading: 'eager'})])),
      u('root', [
        {
          type: 'element',
          tagName: 'img',
          properties: {loading: null},
          children: []
        }
      ])
    )
  })

  await t.test('should work on `[loading]` (`lazy`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('img', {loading: 'lazy'})])),
      u('root', [h('img', {loading: 'lazy'})])
    )
  })

  await t.test('should work on `[loading]` (invalid)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('img', {loading: 'xxx'})])),
      u('root', [
        {
          type: 'element',
          tagName: 'img',
          properties: {loading: null},
          children: []
        }
      ])
    )
  })

  await t.test('should work on `[loading]`, when missing', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('img')])),
      u('root', [h('img')])
    )
  })

  await t.test('should work on `li[type]` (invalid)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('li', {type: 'xxx'})])),
      u('root', [
        {
          type: 'element',
          tagName: 'li',
          properties: {type: null},
          children: []
        }
      ])
    )
  })

  await t.test('should keep an unlisted `target`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('a', {target: 'b'})])),
      u('root', [h('a', {target: 'b'})])
    )
  })

  await t.test('should keep `area[target="_blank"]`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('area', {target: '_blank'})])),
      u('root', [h('area', {target: '_blank'})])
    )
  })

  await t.test('should remove `[target="_self"]` on `base`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('a', {target: '_self'})])),
      u('root', [
        {
          type: 'element',
          tagName: 'a',
          properties: {target: null},
          children: []
        }
      ])
    )
  })

  await t.test('should remove `[target=""]` on `form`', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('form', {target: ''})])),
      u('root', [
        {
          type: 'element',
          tagName: 'form',
          properties: {target: null},
          children: []
        }
      ])
    )
  })

  await t.test('should support `ol[type]`', async function () {
    assert.deepEqual(
      rehype()
        .use({settings})
        .use(min)
        .processSync(
          `<!doctypehtml><title>ol[type]</title>
<ol><li>a<li>b</ol>
<ol type=1><li>a<li>b</ol>
<ol type=2><li>a<li>b</ol>
<ol type=a><li>a<li>b</ol>
<ol type=A><li>a<li>b</ol>
<ol type=i><li>a<li>b</ol>
<ol type=I><li>a<li>b</ol>`
        )
        .toString(),
      `<!doctypehtml><title>ol[type]</title>
<ol><li>a<li>b</ol>
<ol><li>a<li>b</ol>
<ol><li>a<li>b</ol>
<ol type=a><li>a<li>b</ol>
<ol type=A><li>a<li>b</ol>
<ol type=i><li>a<li>b</ol>
<ol type=I><li>a<li>b</ol>`
    )
  })

  await t.test('should support `ul[type]`', async function () {
    assert.deepEqual(
      rehype()
        .use({settings})
        .use(min)
        .processSync(
          `<!doctypehtml><title>ul[type]</title>
<ul><li>a<li>b</ul>
<ul type=circle><li>a<li>b</ul>
<ul type=invalid><li>a<li>b</ul>
<ul type=disc><li>a<li>b</ul>
<ul type=square><li>a<li>b</ul>`
        )
        .toString(),
      `<!doctypehtml><title>ul[type]</title>
<ul><li>a<li>b</ul>
<ul type=circle><li>a<li>b</ul>
<ul><li>a<li>b</ul>
<ul type=disc><li>a<li>b</ul>
<ul type=square><li>a<li>b</ul>`
    )
  })

  await t.test('should support `li[type]`', async function () {
    assert.deepEqual(
      rehype()
        .use({settings})
        .use(min)
        .processSync(
          `<!doctypehtml><title>li[type]</title>
<ol><li>a<li>b</ol>
<ol><li type=1>a<li>b</ol>
<ol><li type=2>a<li>b</ol>
<ol><li type=a>a<li>b</ol>
<ol><li type=A>a<li>b</ol>
<ol><li type=i>a<li>b</ol>
<ol><li type=I>a<li>b</ol>
<ul><li>a<li>b</ul>
<ul><li type=circle>a<li>b</ul>
<ul><li type=invalid>a<li>b</ul>
<ul><li type=disc>a<li>b</ul>
<ul><li type=square>a<li>b</ul>
<ol type=i><li>a<li>b</ol>
<ol type=i><li type=1>a<li>b</ol>
<ol type=i><li type=2>a<li>b</ol>
<ol type=i><li type=a>a<li>b</ol>
<ol type=i><li type=A>a<li>b</ol>
<ol type=i><li type=i>a<li>b</ol>
<ol type=i><li type=I>a<li>b</ol>
<ul type=square><li>a<li>b</ul>
<ul type=square><li type=circle>a<li>b</ul>
<ul type=square><li type=invalid>a<li>b</ul>
<ul type=square><li type=disc>a<li>b</ul>
<ul type=square><li type=square>a<li>b</ul>`
        )
        .toString(),
      `<!doctypehtml><title>li[type]</title>
<ol><li>a<li>b</ol>
<ol><li type=1>a<li>b</ol>
<ol><li>a<li>b</ol>
<ol><li type=a>a<li>b</ol>
<ol><li type=A>a<li>b</ol>
<ol><li type=i>a<li>b</ol>
<ol><li type=I>a<li>b</ol>
<ul><li>a<li>b</ul>
<ul><li type=circle>a<li>b</ul>
<ul><li>a<li>b</ul>
<ul><li type=disc>a<li>b</ul>
<ul><li type=square>a<li>b</ul>
<ol type=i><li>a<li>b</ol>
<ol type=i><li type=1>a<li>b</ol>
<ol type=i><li>a<li>b</ol>
<ol type=i><li type=a>a<li>b</ol>
<ol type=i><li type=A>a<li>b</ol>
<ol type=i><li type=i>a<li>b</ol>
<ol type=i><li type=I>a<li>b</ol>
<ul type=square><li>a<li>b</ul>
<ul type=square><li type=circle>a<li>b</ul>
<ul type=square><li>a<li>b</ul>
<ul type=square><li type=disc>a<li>b</ul>
<ul type=square><li type=square>a<li>b</ul>`
    )
  })

  await t.test('should support `form[target]`', async function () {
    assert.deepEqual(
      rehype()
        .use({settings})
        .use(min)
        .processSync(
          `<!doctypehtml><title>form[target]</title>
<form></form>
<form target=""></form>
<form target=valid-browser-context-name></form>
<form target=_blank></form>
<form target=_self></form>
<form target=_parent></form>
<form target=_top></form>`
        )
        .toString(),
      `<!doctypehtml><title>form[target]</title>
<form></form>
<form></form>
<form target=valid-browser-context-name></form>
<form target=_blank></form>
<form></form>
<form target=_parent></form>
<form target=_top></form>`
    )
  })

  await t.test('should support `form[autocomplete]`', async function () {
    assert.deepEqual(
      rehype()
        .use({settings})
        .use(min)
        .processSync(
          `<!doctypehtml><title>form[autocomplete]</title>
<form></form>
<form autocomplete=some-text></form>
<form autocomplete=on></form>
<form autocomplete=off></form>`
        )
        .toString(),
      `<!doctypehtml><title>form[autocomplete]</title>
<form></form>
<form></form>
<form></form>
<form autocomplete=off></form>`
    )
  })

  await t.test('should support `form[method]`', async function () {
    assert.deepEqual(
      rehype()
        .use({settings})
        .use(min)
        .processSync(
          `<!doctypehtml><title>form[method]</title>
<form></form>
<form method=some-text></form>
<form method=get></form>
<form method=post></form>
<form method=dialog></form>`
        )
        .toString(),
      `<!doctypehtml><title>form[method]</title>
<form></form>
<form></form>
<form></form>
<form method=post></form>
<form method=dialog></form>`
    )
  })

  await t.test('should support `form[enctype]`', async function () {
    assert.deepEqual(
      rehype()
        .use({settings})
        .use(min)
        .processSync(
          `<!doctypehtml><title>form[enctype]</title>
<form></form>
<form enctype=some-text></form>
<form enctype=application/x-www-form-urlencoded></form>
<form enctype=multipart/form-data></form>
<form enctype=text/plain></form>`
        )
        .toString(),
      `<!doctypehtml><title>form[enctype]</title>
<form></form>
<form></form>
<form></form>
<form enctype=multipart/form-data></form>
<form enctype=text/plain></form>`
    )
  })

  await t.test('should support `img[decoding]`', async function () {
    assert.deepEqual(
      rehype()
        .use({settings})
        .use(min)
        .processSync(
          `<!doctypehtml><title>img[decoding]</title>
<img>
<img decoding=some-text>
<img decoding=auto>
<img decoding=sync>
<img decoding=async>`
        )
        .toString(),
      `<!doctypehtml><title>img[decoding]</title>
<img>
<img>
<img>
<img decoding=sync>
<img decoding=async>`
    )
  })

  await t.test(
    'should support `input[formmethod]`, `button[formmethod]`',
    async function () {
      assert.deepEqual(
        rehype()
          .use({settings})
          .use(min)
          .processSync(
            `<!doctypehtml><title>input[formmethod],button[formmethod]</title>
<input>
<input formmethod=some-text>
<input formmethod=get>
<input formmethod=post>
<input formmethod=dialog>
<button></button>
<button formmethod=some-text></button>
<button formmethod=get></button>
<button formmethod=post></button>
<button formmethod=dialog></button>`
          )
          .toString(),
        `<!doctypehtml><title>input[formmethod],button[formmethod]</title>
<input>
<input formmethod=a>
<input formmethod=a>
<input formmethod=post>
<input formmethod=dialog>
<button></button>
<button formmethod=a></button>
<button formmethod=a></button>
<button formmethod=post></button>
<button formmethod=dialog></button>`
      )
    }
  )

  await t.test(
    'should support `input[formmethod]`, `button[formmethod]`',
    async function () {
      assert.deepEqual(
        rehype()
          .use({settings})
          .use(min)
          .processSync(
            `<!doctypehtml><title>input[formmethod],button[formmethod]</title>
<input>
<input formmethod=some-text>
<input formmethod=get>
<input formmethod=post>
<input formmethod=dialog>
<button></button>
<button formmethod=some-text></button>
<button formmethod=get></button>
<button formmethod=post></button>
<button formmethod=dialog></button>`
          )
          .toString(),
        `<!doctypehtml><title>input[formmethod],button[formmethod]</title>
<input>
<input formmethod=a>
<input formmethod=a>
<input formmethod=post>
<input formmethod=dialog>
<button></button>
<button formmethod=a></button>
<button formmethod=a></button>
<button formmethod=post></button>
<button formmethod=dialog></button>`
      )
    }
  )

  await t.test(
    'should support `input[formtarget]`, `button[formtarget]`',
    async function () {
      assert.deepEqual(
        rehype()
          .use({settings})
          .use(min)
          .processSync(
            `<!doctypehtml><title>input[formtarget],button[formtarget]</title>
<input>
<input formtarget="">
<input formtarget=valid-browser-context-name>
<input formtarget=_blank>
<input formtarget=_self>
<input formtarget=_plain>
<button></button>
<button formtarget=""></button>
<button formtarget=valid-browser-context-name></button>
<button formtarget=_blank></button>
<button formtarget=_self></button>
<button formtarget=_plain></button>`
          )
          .toString(),
        `<!doctypehtml><title>input[formtarget],button[formtarget]</title>
<input>
<input formtarget>
<input formtarget=valid-browser-context-name>
<input formtarget=_blank>
<input formtarget=_self>
<input formtarget=_plain>
<button></button>
<button formtarget></button>
<button formtarget=valid-browser-context-name></button>
<button formtarget=_blank></button>
<button formtarget=_self></button>
<button formtarget=_plain></button>`
      )
    }
  )
})
