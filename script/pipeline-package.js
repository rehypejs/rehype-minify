/**
 * @typedef {import('comment-parser').Spec} Spec
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').TopLevelContent} TopLevelContent
 * @typedef {import('parse-author').Author} Author
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('unified').Plugin} Plugin
 */

/**
 * @typedef Context
 *   Info passed around for each package.
 * @property {URL} ancestor
 *   URL to monorepo.
 * @property {PackageJson} ancestorPackage
 *   Package of monorepo.
 * @property {string} name
 *   Name of package.
 * @property {URL} packageFolder
 *   Folder of package.
 * @property {URL} packagesFolder
 *   Folder of packages.
 * @property {Array<string>} plugins
 *   Plugins in monorepo.
 *
 * @typedef Specifiers
 *   Parsed specifiers of a module.
 * @property {string | undefined} default
 *   Name of default export.
 * @property {Array<string>} named
 *   Names of named exports.
 *
 * @typedef State
 *   Info passed around.
 * @property {Author} author
 *   Author.
 * @property {Context} context
 *   Broader context.
 * @property {string} id
 *   Name of package as a JS identifier.
 * @property {string} license
 *   SPDX.
 * @property {string} remote
 *   URL to monorepo on GH.
 * @property {Map<string, string>} urls
 *   Possible definitions for link references.
 * @property {string} versionMajor
 *   Major version of package.
 */

import assert from 'node:assert/strict'
import {exec as execCallback} from 'node:child_process'
import {relative, sep} from 'node:path'
import {fileURLToPath} from 'node:url'
import {inspect, promisify} from 'node:util'
import {parse} from 'comment-parser'
import {name as isIdentifierName} from 'estree-util-is-identifier-name'
import {slug} from 'github-slugger'
import {findAndReplace} from 'mdast-util-find-and-replace'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown, gfmToMarkdown} from 'mdast-util-gfm'
import {toMarkdown} from 'mdast-util-to-markdown'
import {toString} from 'mdast-util-to-string'
import {gfm} from 'micromark-extension-gfm'
import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import parseAuthor from 'parse-author'
import {rehype} from 'rehype'
import rehypeFormat from 'rehype-format'
import remarkPresetWooorm from 'remark-preset-wooorm'
import stripIndent from 'strip-indent'
import {read} from 'to-vfile'
import {visit} from 'unist-util-visit'
import {VFile} from 'vfile'
import {findDownAll} from 'vfile-find-down'

const exec = promisify(execCallback)

/**
 * @param {Context} context
 *   Context.
 * @returns {Promise<Array<VFile>>}
 *   Promise to `package.json`s and other metadata files.
 */
export async function pipelinePackage(context) {
  const packageFile = await generatePackageJson(context)

  /** @type {PackageJson} */
  const packageJson = JSON.parse(String(packageFile))

  /** @type {Author | undefined} */
  let author

  if (typeof packageJson.author === 'string') {
    author = parseAuthor(packageJson.author)
  } else {
    packageFile.message('Expected `author` in local `package.json` as a string')
  }

  assert(author)

  const remote = context.ancestorPackage.repository
  assert(remote, 'expected `remote` set in monorepo `package.json`')
  assert(
    typeof remote === 'string',
    'expected `remote` as string in monorepo `package.json`'
  )

  /** @type {State} */
  const state = {
    author,
    context,
    id: context.name
      .replace(/-([a-z])/g, function (_, /** @type {string} */ $1) {
        return $1.toUpperCase()
      })
      .replace(/Javascript/g, 'JavaScript'),
    license: packageJson.license || 'MIT',
    remote,
    urls: new Map(),
    versionMajor: (packageJson.version || '0').split('.')[0]
  }

  return [packageFile, generateNmrc(state), ...(await generateReadme(state))]
}

/**
 * @param {Context} context
 *   Info passed around.
 * @returns {Promise<VFile>}
 *   Files.
 */
async function generatePackageJson(context) {
  const folderPath = relative(
    fileURLToPath(context.ancestor),
    fileURLToPath(context.packageFolder)
  )

  const [files, file, commitResult] = await Promise.all([
    findDownAll(['.js', '.ts'], fileURLToPath(context.packageFolder)),
    read(new URL('package.json', context.packageFolder)),
    exec('git log --all --format="%cN <%cE>" "' + folderPath + '"')
  ])

  const codePaths = files.map(function (file) {
    return relative(fileURLToPath(context.packageFolder), file.path)
  })

  /** @type {PackageJson} */
  const previousPackage = JSON.parse(String(file))
  const ancestorPackage = context.ancestorPackage
  assert(ancestorPackage.author)

  const gitContributors = [...new Set(commitResult.stdout.split('\n'))]
    .sort()
    .filter(Boolean)
    .filter(function (d) {
      return !d.includes('<noreply')
    })

  // @ts-expect-error: `type-fest` has bugs.
  /** @satisfies {Partial<PackageJson>} */
  const packageJson = {
    name: context.name,
    version: previousPackage.version,
    description: previousPackage.description,
    license: ancestorPackage.license,
    keywords: (previousPackage.keywords || []).sort(),
    repository: ancestorPackage.repository + '/tree/main/' + folderPath,
    bugs: ancestorPackage.bugs,
    funding: ancestorPackage.funding,
    author: ancestorPackage.author,
    contributors:
      gitContributors.length > 0 ? gitContributors : [ancestorPackage.author],
    sideEffects: false,
    type: 'module',
    main: 'index.js',
    types: 'index.d.ts',
    files: codePaths
      .filter(function (name) {
        return !/test/.test(name)
      })
      .map((d) => {
        const index = d.indexOf(sep)
        return index === -1 ? d : d.slice(0, index + 1)
      })
      .filter(function (d, index, all) {
        return all.indexOf(d) === index
      })
      .sort(),
    dependencies: previousPackage.dependencies,
    scripts: {},
    excludeFromPreset: previousPackage.excludeFromPreset,
    typeCoverage: {
      atLeast: 100,
      detail: true,
      ignoreCatch: true,
      strict: true
    },
    xo: false
  }

  file.value = JSON.stringify(packageJson, undefined, 2) + '\n'
  file.data.changed = true

  return file
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {VFile}
 *   File.
 */
function generateNmrc(state) {
  const file = new VFile({
    path: new URL('.npmrc', state.context.packageFolder),
    value: ['ignore-scripts=true', 'package-lock=false', ''].join('\n')
  })

  file.data.changed = true

  return file
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Promise<Array<VFile>>}
 *   Files.
 */
// eslint-disable-next-line complexity
async function generateReadme(state) {
  const moduleUrl = new URL('index.js', state.context.packageFolder)
  // To do: move files to `lib/index.js`?
  /** @type {[VFile, Record<string, unknown>]} */
  const [indexFile, indexModule] = await Promise.all([
    read(moduleUrl),
    import(moduleUrl.href)
  ])

  const file = new VFile(new URL('readme.md', state.context.packageFolder))

  // Check identifier name.
  if (!isIdentifierName(state.id)) {
    const message = indexFile.message('Expected a valid identifier as name')
    message.fatal = true
  }

  // Check plugin names.
  if (state.context.plugins.includes(state.context.name)) {
    if (
      !('default' in indexModule) ||
      !indexModule.default ||
      typeof indexModule.default !== 'function'
    ) {
      const message = indexFile.message('Expected `export default` in plugin')
      message.fatal = true
    } else if (indexModule.default.name !== state.id) {
      const message = indexFile.message(
        'Unexpected export default `' +
          indexModule.default.name +
          '`, expected `' +
          state.id +
          '`'
      )
      message.fatal = true
    }
  }

  /** @type {Specifiers} */
  const specifiers = {
    default:
      'default' in indexModule && indexModule.default ? state.id : undefined,
    named: Object.keys(indexModule).filter(function (d) {
      return d !== 'default'
    })
  }

  const block = parse(String(indexFile), {spacing: 'preserve'})
  const fileInfo = block[0] || {}

  const tags = fileInfo.tags || []
  const exampleTag = tags.find(function (d) {
    return d.tag === 'example'
  })
  const description = stripIndent(fileInfo.description || '').trim()

  const explicitDocs = fromMarkdown(description, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  })

  /** @type {Record<string, Array<TopLevelContent>>} */
  const categories = {}
  let category = 'intro'
  let contentIndex = -1

  while (++contentIndex < explicitDocs.children.length) {
    const node = /** @type {TopLevelContent} */ (
      explicitDocs.children[contentIndex]
    )

    if (node.type === 'heading' && node.depth === 2) {
      category = slug(toString(node))
    }

    if (!(category in categories)) {
      categories[category] = []
    }

    categories[category].push(node)
  }

  if (!categories.intro || categories.intro.length === 0) {
    indexFile.message('Missing `intro` section in description')
  }

  if (!categories.use) {
    if (
      state.context.name === 'rehype-preset-minify' ||
      state.context.plugins.includes(state.context.name)
    ) {
      categories.use = generateReadmePluggableUseSection(state)
    } else {
      indexFile.message('Missing `use` section in description')
    }
  }

  if (!categories.api) {
    indexFile.message('Missing `api` section in description')
    categories.api = []
  }

  if (
    state.context.name === 'rehype-preset-minify' ||
    state.context.plugins.includes(state.context.name)
  ) {
    if (exampleTag) {
      categories.example = generateReadmePluggableExampleSection(
        state,
        // @ts-expect-error: assume it is usable.
        indexModule.default,
        exampleTag
      )
    } else {
      indexFile.message('Missing `@example` comment in description')
    }
  }

  const [apiHeading, ...apiRest] = categories.api || []

  if (categories.intro) {
    state.urls.set('hast', 'https://github.com/syntax-tree/hast')
    state.urls.set('rehype', 'https://github.com/rehypejs/rehype')
    /** @type {Root} */
    const fragment = {type: 'root', children: categories.intro}
    findAndReplace(
      fragment,
      ['hast', 'rehype'].map(function (d) {
        return [
          d,
          function () {
            const code = d === 'hast'
            /** @type {PhrasingContent} */
            let result = code
              ? {type: 'inlineCode', value: d}
              : {type: 'text', value: d}

            result = {
              type: 'linkReference',
              identifier: d,
              referenceType: code ? 'full' : 'collapsed',
              children: [result]
            }

            if (d === 'rehype') {
              result = {type: 'strong', children: [result]}
            }

            return result
          }
        ]
      })
    )
  }

  /** @type {Array<TopLevelContent>} */
  const topLevelContent = [
    ...generateReadmeHead(state),
    ...generateReadmeMeta(state),
    ...(categories.intro || []),
    {type: 'heading', depth: 2, children: [{type: 'text', value: 'Contents'}]},
    ...(categories['what-is-this'] || []),
    ...(categories['when-should-i-use-this'] || []),
    ...generateReadmeInstall(state, specifiers),
    ...(categories.use || []),
    ...(apiHeading
      ? [apiHeading, ...generateReadmeApiByline(state, specifiers), ...apiRest]
      : []),
    ...(categories.example || []),
    ...generateReadmeTail(state)
  ]

  /** @type {Root} */
  const tree = {type: 'root', children: topLevelContent}
  /** @type {Set<string>} */
  const used = new Set()

  visit(tree, function (node) {
    if ('identifier' in node && 'referenceType' in node) {
      const id = normalizeIdentifier(node.identifier).toLowerCase()

      if (state.urls.has(id)) {
        used.add(id)
      } else {
        file.message(
          'Missing link reference in `state.urls` for `' + id + '`',
          node
        )
      }
    }
  })

  for (const identifier of [...used].sort()) {
    const url = state.urls.get(identifier)
    assert(url)
    tree.children.push({type: 'definition', identifier, url})
  }

  file.value = toMarkdown(tree, {
    // To do: remove after major: plan is to match defaults.
    ...remarkPresetWooorm.settings,
    // To do: remove after major.
    listItemIndent: 'tab',
    extensions: [gfmToMarkdown()]
  })
  file.data.changed = true

  return [file, indexFile]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeHead(state) {
  return [
    {type: 'html', value: '<!--This file is generated-->'},
    {
      type: 'heading',
      depth: 1,
      children: [{type: 'text', value: state.context.name}]
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeMeta(state) {
  const packageName = state.context.name
  const ghSlug = state.remote.split('/').slice(-2).join('/')
  const ghUrl = 'https://github.com/' + ghSlug

  state.urls.set('build', ghUrl + '/actions')
  state.urls.set('build-badge', ghUrl + '/workflows/main/badge.svg')
  state.urls.set('coverage', 'https://codecov.io/github/' + ghSlug)
  state.urls.set(
    'coverage-badge',
    'https://img.shields.io/codecov/c/github/' + ghSlug + '.svg'
  )
  state.urls.set('downloads', 'https://www.npmjs.com/package/' + packageName)
  state.urls.set(
    'downloads-badge',
    'https://img.shields.io/npm/dm/' + packageName + '.svg'
  )
  // To do: update.
  state.urls.set('size', 'https://bundlephobia.com/result?p=' + packageName)
  state.urls.set(
    'size-badge',
    // To do: update.
    'https://img.shields.io/bundlephobia/minzip/' + packageName + '.svg'
  )
  state.urls.set('size', 'https://bundlephobia.com/result?p=' + packageName)
  state.urls.set(
    'sponsors-badge',
    'https://opencollective.com/unified/sponsors/badge.svg'
  )
  state.urls.set('funding', 'https://opencollective.com/unified')
  state.urls.set(
    'funding-sponsors-badge',
    'https://opencollective.com/unified/sponsors/badge.svg'
  )
  state.urls.set(
    'funding-backers-badge',
    'https://opencollective.com/unified/backers/badge.svg'
  )
  state.urls.set('chat', 'https://github.com/rehypejs/rehype/discussions')
  state.urls.set(
    'chat-badge',
    'https://img.shields.io/badge/chat-discussions-success.svg'
  )

  return [
    {
      type: 'paragraph',
      children: [
        {
          type: 'linkReference',
          identifier: 'build',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'build-badge',
              referenceType: 'full',
              alt: 'Build'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'coverage',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'coverage-badge',
              referenceType: 'full',
              alt: 'Coverage'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'downloads',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'downloads-badge',
              referenceType: 'full',
              alt: 'Downloads'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'size',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'size-badge',
              referenceType: 'full',
              alt: 'Size'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'funding',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'funding-sponsors-badge',
              referenceType: 'full',
              alt: 'Sponsors'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'funding',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'funding-backers-badge',
              referenceType: 'full',
              alt: 'Backers'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'chat',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'chat-badge',
              referenceType: 'full',
              alt: 'Chat'
            }
          ]
        }
      ]
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Specifiers} specifiers
 *   Specifiers.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeInstall(state, specifiers) {
  let defaultImportSummary = specifiers.default
  /** @type {string | undefined} */
  let specifiersImportSummary

  if (specifiers.named.length > 3) {
    // Star import will include the default.
    defaultImportSummary = undefined
    specifiersImportSummary = '* as ' + state.id
  } else if (specifiers.named.length > 0) {
    specifiersImportSummary = '{' + specifiers.named.join(', ') + '}'
  }

  const importCodeSummary =
    defaultImportSummary && specifiersImportSummary
      ? defaultImportSummary + ', ' + specifiersImportSummary
      : defaultImportSummary || specifiersImportSummary
  assert(importCodeSummary)

  state.urls.set(
    'esm',
    'https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c'
  )
  state.urls.set('npm', 'https://docs.npmjs.com/cli/install')
  state.urls.set('esm-sh', 'https://esm.sh')

  return [
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Install'}]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'This package is '},
        {
          type: 'linkReference',
          identifier: 'esm',
          referenceType: 'full',
          children: [{type: 'text', value: 'ESM only'}]
        },
        {
          type: 'text',
          value: '.\nIn Node.js (version 16+), install with '
        },
        {
          type: 'linkReference',
          identifier: 'npm',
          referenceType: 'collapsed',
          children: [{type: 'text', value: 'npm'}]
        },
        {type: 'text', value: ':'}
      ]
    },
    {type: 'code', lang: 'sh', value: 'npm install ' + state.context.name},
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'In Deno with '},
        {
          type: 'linkReference',
          identifier: 'esm-sh',
          label: 'esm-sh',
          referenceType: 'full',
          children: [{type: 'inlineCode', value: 'esm.sh'}]
        },
        {type: 'text', value: ':'}
      ]
    },
    {
      type: 'code',
      // To do: use estree, prettier?
      lang: 'js',
      value:
        'import ' +
        importCodeSummary +
        " from 'https://esm.sh/" +
        state.context.name +
        '@' +
        state.versionMajor +
        "'"
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'In browsers with '},
        {
          type: 'linkReference',
          identifier: 'esm-sh',
          label: 'esm-sh',
          referenceType: 'full',
          children: [{type: 'inlineCode', value: 'esm.sh'}]
        },
        {type: 'text', value: ':'}
      ]
    },
    {
      type: 'code',
      lang: 'html',
      value:
        '<script type="module">\n  import ' +
        importCodeSummary +
        " from 'https://esm.sh/" +
        state.context.name +
        '@' +
        state.versionMajor +
        "?bundle'\n</script>"
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmePluggableUseSection(state) {
  /** @type {Array<[string, string]>} */
  const imports = [
    [state.id, state.context.name],
    ['rehypeParse', 'rehype-parse'],
    ['rehypeStringify', 'rehype-stringify'],
    ['{read}', 'to-vfile'],
    ['{unified}', 'unified']
  ]

  imports.sort(function (a, b) {
    return a[1].localeCompare(b[1])
  })

  return [
    {type: 'heading', depth: 2, children: [{type: 'text', value: 'Use'}]},
    {
      type: 'paragraph',
      children: [{type: 'text', value: 'On the API:'}]
    },
    {
      type: 'code',
      lang: 'js',
      // To do: use estree, prettier?
      value: [
        ...imports.map(function (d) {
          return 'import ' + d[0] + " from '" + d[1] + "'"
        }),
        '',
        'const file = await unified()',
        '  .use(rehypeParse)',
        // To do: options?
        '  .use(' + state.id + ')',
        '  .use(rehypeStringify)',
        "  .process(await read('index.html'))",
        '',
        'console.log(String(file))'
      ].join('\n')
    },
    {type: 'paragraph', children: [{type: 'text', value: 'On the CLI:'}]},
    {
      type: 'code',
      lang: 'sh',
      value:
        'rehype input.html --use ' +
        // To do: options?
        state.context.name +
        ' --output output.html'
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'On the CLI in a config file (here a '
        },
        {
          type: 'inlineCode',
          value: 'package.json'
        },
        {
          type: 'text',
          value: '):'
        }
      ]
    },
    {
      type: 'code',
      lang: 'diff',
      value: [
        ' …',
        ' "rehype": {',
        '   "plugins": [',
        '     …',
        '+    "' + state.context.name + '",',
        '     …',
        '   ]',
        ' }',
        ' …'
      ].join('\n')
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Specifiers} specifiers
 *   Specifiers.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeApiByline(state, specifiers) {
  /** @type {Paragraph} */
  const byline = {type: 'paragraph', children: []}

  if (specifiers.named.length > 0) {
    byline.children.push({
      type: 'text',
      value: 'This package exports the following identifiers:\n'
    })

    let index = -1

    while (++index < specifiers.named.length) {
      if (index !== 0) {
        byline.children.push({type: 'text', value: ', '})
      }

      // To do: link.
      byline.children.push({type: 'inlineCode', value: specifiers.named[index]})
    }

    byline.children.push({type: 'text', value: '.'})
  } else {
    byline.children.push({
      type: 'text',
      value: 'This package exports no identifiers.'
    })
  }

  if (specifiers.default) {
    byline.children.push(
      {type: 'text', value: '\nThe default export is '},
      // To do: link.
      {type: 'inlineCode', value: state.id},
      {type: 'text', value: '.'}
    )
  } else {
    byline.children.push({type: 'text', value: '\nThere is no default export.'})
  }

  return [byline]
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Plugin} plugin
 *   Plugin.
 * @param {Spec} example
 *   Example.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmePluggableExampleSection(state, plugin, example) {
  /** @type {Record<string, unknown>} */
  let options = {}
  const lines = example.description.replace(/^\r?\n|\r?\n$/g, '').split('\n')
  const [headLine, ...restLines] = lines

  try {
    options = JSON.parse(headLine)
  } catch {
    // To do: warn.
    restLines.unshift(headLine)
  }

  const exampleValue = stripIndent(restLines.join('\n').replace(/^\r?\n/g, ''))
  /** @type {Paragraph} */
  const byline = {type: 'paragraph', children: []}

  state.urls.set('rehype-format', 'https://github.com/rehypejs/rehype-format')

  // To do: validate schema?
  if (options.plugin || options.format) {
    byline.children.push({type: 'text', value: '(with '})

    if (options.plugin) {
      byline.children.push(
        {type: 'inlineCode', value: inspect(options.plugin)},
        {type: 'text', value: ' as options'}
      )
    }

    if (options.plugin && options.format) {
      byline.children.push({type: 'text', value: ' and with '})
    }

    if (options.format) {
      byline.children.push({
        type: 'linkReference',
        identifier: 'rehype-format',
        referenceType: 'full',
        children: [{type: 'inlineCode', value: 'rehype-format'}]
      })
    }

    byline.children.push({type: 'text', value: ')'})
  }

  return [
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Example'}]
    },
    {type: 'heading', depth: 6, children: [{type: 'text', value: 'In'}]},
    {type: 'code', lang: 'html', value: exampleValue},
    {type: 'heading', depth: 6, children: [{type: 'text', value: 'Out'}]},
    ...(byline.children.length > 0 ? [byline] : []),
    {
      type: 'code',
      lang: 'html',
      // To do: use estree, prettier, to generate an actual example?
      // Or: this seems more like the `Use` example above?
      value: rehype()
        // Assume `fragment` as default.
        .data('settings', options.processor || {fragment: true})
        // @ts-expect-error: `undefined` is fine.
        .use(plugin, options.plugin || undefined)
        // @ts-expect-error: `undefined` is fine to pass.
        .use(options.format ? rehypeFormat : undefined)
        .processSync(exampleValue)
        .toString()
        .trim()
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeTail(state) {
  const org = state.remote.split('/').slice(0, -1).join('/')
  const health = org + '/.github'
  const hMain = health + '/blob/main'

  state.urls.set('hast', 'https://github.com/syntax-tree/hast')
  state.urls.set('typescript', 'https://www.typescriptlang.org')
  state.urls.set('xss', 'https://en.wikipedia.org/wiki/Cross-site_scripting')
  state.urls.set(
    'rehype-sanitize',
    'https://github.com/rehypejs/rehype-sanitize'
  )
  state.urls.set('contributing', hMain + '/contributing.md')
  state.urls.set('support', hMain + '/support.md')
  state.urls.set('coc', hMain + '/code-of-conduct.md')
  state.urls.set('health', health)
  state.urls.set('license', state.remote + '/blob/main/license')
  state.urls.set('author', String(state.author.url || ''))

  return [
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Syntax'}]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value:
            // To do: `HTML is parsed according to WHATWG HTML (the living standard), which is also followed by all browsers.`
            'HTML is handled according to WHATWG HTML (the living standard), which is also\nfollowed by browsers such as Chrome and Firefox.'
        }
      ]
    },
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Syntax tree'}]
    },
    {
      type: 'paragraph',
      children: [
        // To do: remove `format`.
        {type: 'text', value: 'The syntax tree format used is '},
        {
          type: 'linkReference',
          identifier: 'hast',
          referenceType: 'full',
          // To do: just text.
          children: [{type: 'inlineCode', value: 'hast'}]
        },
        {type: 'text', value: '.'}
      ]
    },
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Types'}]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'This package is fully typed with '},
        {
          type: 'linkReference',
          identifier: 'TypeScript',
          referenceType: 'collapsed',
          children: [{type: 'text', value: 'TypeScript'}]
        },
        {type: 'text', value: '.'}
        // To do: list and link exposed types.
      ]
    },
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Compatibility'}]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          // To do: update: <https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse#compatibility>.
          value:
            'Projects maintained by the unified collective are compatible with all maintained\nversions of Node.js.\nAs of now, that is Node.js 12.20+, 14.14+, and 16.0+.\nOur projects sometimes work with older versions, but this is not guaranteed.'
        }
      ]
    },
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Security'}]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'As '},
        {type: 'strong', children: [{type: 'text', value: 'rehype'}]},
        {
          type: 'text',
          value:
            ' works on HTML and improper use of HTML can open you up to a\n'
        },
        {
          type: 'linkReference',
          identifier: 'xss',
          referenceType: 'full',
          children: [{type: 'text', value: 'cross-site scripting (XSS)'}]
        },
        {
          type: 'text',
          value: ' attack, use of rehype can also be unsafe.\nUse '
        },
        {
          type: 'linkReference',
          identifier: 'rehype-sanitize',
          referenceType: 'full',
          children: [{type: 'inlineCode', value: 'rehype-sanitize'}]
        },
        {type: 'text', value: ' to make the tree safe.'}
      ]
    },
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Contribute'}]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'See '},
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'contributing',
          children: [{type: 'inlineCode', value: 'contributing.md'}]
        },
        {type: 'text', value: ' in '},
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'health',
          children: [{type: 'inlineCode', value: 'rehypejs/.github'}]
        },
        {type: 'text', value: ' for ways\nto get started.\nSee '},
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'support',
          children: [{type: 'inlineCode', value: 'support.md'}]
        },
        {type: 'text', value: ' for ways to get help.'}
      ]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'This project has a '},
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'coc',
          children: [{type: 'text', value: 'code of conduct'}]
        },
        {
          type: 'text',
          value:
            '.\nBy interacting with this repository, organization, or community you agree to\nabide by its terms.'
        }
      ]
    },
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'License'}]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'license',
          children: [{type: 'text', value: String(state.license || '')}]
        },
        {type: 'text', value: ' © '},
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'author',
          children: [{type: 'text', value: String(state.author.name || '')}]
        }
      ]
    }
  ]
}
