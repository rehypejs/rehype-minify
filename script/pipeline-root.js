/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').Html} Html
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('./benchmark.js').CleanResult} CleanResult
 * @typedef {import('./benchmark.js').Datum} Datum
 */

import assert from 'node:assert/strict'
import {basename} from 'node:path'
import bytes from 'bytes'
import {h} from 'hastscript'
import {toHtml} from 'hast-util-to-html'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown, gfmToMarkdown} from 'mdast-util-gfm'
import {toMarkdown} from 'mdast-util-to-markdown'
import {zone} from 'mdast-zone'
import {gfm} from 'micromark-extension-gfm'
import rehypeFormat from 'rehype-format'
import remarkPresetWooorm from 'remark-preset-wooorm'
import {read} from 'to-vfile'

/**
 * @param {URL} ancestor
 * @param {Array<VFile>} files
 * @returns {Promise<Array<VFile>>}
 */
export async function pipelineRoot(ancestor, files) {
  // Gather which plugins are used or not in the preset.
  // Also check if the preset matches the metadata in each plugin.
  const presetModule = files.find(function (d) {
    return (
      d.basename === 'index.js' &&
      basename(d.dirname || '').startsWith('rehype-preset-')
    )
  })
  assert(presetModule)
  const preset = String(presetModule)
  /** @type {Set<string>} */
  const included = new Set()
  /** @type {Set<string>} */
  const excluded = new Set()

  for (const file of files) {
    const folder = basename(file.dirname || '')

    if (
      file.basename !== 'package.json' ||
      folder.startsWith('rehype-preset-') ||
      !folder.startsWith('rehype-')
    ) {
      continue
    }

    /** @type {PackageJson} */
    const {excludeFromPreset, name} = JSON.parse(String(file))
    assert(name)
    const include = preset.includes(name)

    if (include && excludeFromPreset) {
      presetModule.message('Unexpected use of `' + name + '`')
    } else if (!excludeFromPreset && !include) {
      presetModule.message('Missing use of `' + name + '`')
    }

    const list = include ? included : excluded
    list.add(name)
  }

  /** @type {Array<Datum>} */
  const data = JSON.parse(
    String(await read(new URL('benchmark-results.json', import.meta.url)))
  )

  const readme = await read(new URL('readme.md', ancestor))
  const tree = fromMarkdown(String(readme), {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  })

  zone(tree, 'plugins-core', function (start, _, end) {
    return [start, createList(included), end]
  })
  zone(tree, 'plugins-other', function (start, _, end) {
    return [start, createList(excluded), end]
  })
  zone(tree, 'benchmark', function (start, _, end) {
    return [start, createTable(data), end]
  })

  readme.value = toMarkdown(tree, {
    // To do: remove after major: plan is to match defaults.
    ...remarkPresetWooorm.settings,
    // To do: remove after major.
    listItemIndent: 'tab',
    extensions: [gfmToMarkdown()]
  })
  readme.data.changed = true

  return [readme]
}

/**
 * @param {Set<string>} list
 * @returns {List}
 */
function createList(list) {
  return {
    type: 'list',
    spread: false,
    ordered: false,
    children: [...list].sort().map(function (name) {
      return {
        type: 'listItem',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'link',
                url: './packages/' + name,
                children: [{type: 'inlineCode', value: name}]
              }
            ]
          }
        ]
      }
    })
  }
}

/**
 * @param {Array<Datum>} data
 * @returns {Html}
 */
function createTable(data) {
  /** @type {['raw', 'gzip']} */
  const types = ['raw', 'gzip']
  /** @type {Array<ElementContent>} */
  const h1 = [h('th', {rowSpan: 2}, 'name')]
  /** @type {Array<ElementContent>} */
  let h2 = []
  /** @type {Array<ElementContent>} */
  let foot = [h('th', {scope: 'row'}, 'total')]
  /** @type {Record<string, number>} */
  const sum = {}

  const body = data.map((d) => {
    const cells = [
      h('th', {scope: 'row', align: 'left'}, h('a', {href: d.url}, d.name))
    ]

    let index = -1

    while (++index < types.length) {
      const type = types[index]
      let offset = 0 // Skip first.
      /** @type {CleanResult | undefined}} */
      let best

      while (++offset < d.results.length) {
        if (!best || d.results[offset][type] < best[type]) {
          best = d.results[offset]
        }
      }

      offset = -1

      while (++offset < d.results.length) {
        const r = d.results[offset]
        const key = type + ':' + r.type
        /** @type {`${type}Win`} */
        // @ts-expect-error: hush.
        const win = type + 'Win'
        /** @type {Element | string} */
        let value = r.type === 'original' ? bytes(r[type]) : r[win]

        sum[key] = (sum[key] || 0) + r[type]

        if (value === '0.00%') {
          value = '💥'
        }

        if (r === best) {
          value = h('b', value)
        }

        cells.push(h('td', {align: 'right'}, value))
      }
    }

    return h('tr', cells)
  })

  let index = -1

  while (++index < types.length) {
    const type = types[index]
    const head = data[0]
    const cells = head.results.map((d) => h('th', d.type))
    h1.push(h('th', {colSpan: cells.length}, type))
    h2 = h2.concat(cells)
    foot = foot.concat(
      head.results.map((d) =>
        h('td', {align: 'right'}, bytes(sum[type + ':' + d.type]))
      )
    )
  }

  const tree = h('table', [
    h('thead', h('tr', h1), h('tr', h2)),
    h('tbody', body),
    h('tfoot', h('tr', foot))
  ])

  // @ts-expect-error: fine. Will be OK after `rehype-format` is released.
  rehypeFormat()(tree)

  return {type: 'html', value: toHtml(tree)}
}
