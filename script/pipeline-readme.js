/**
 * @typedef {import('trough').Callback} Next
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('mdast').BlockContent} BlockContent
 * @typedef {import('mdast').DefinitionContent} DefinitionContent
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-find-and-replace').ReplaceFunction} ReplaceFunction
 */

import fs from 'node:fs'
import path from 'node:path'
import {inspect} from 'node:util'
import {parse} from 'comment-parser'
import {slug as githubSlug} from 'github-slugger'
import {findAndReplace} from 'mdast-util-find-and-replace'
import {toString} from 'mdast-util-to-string'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import {remark} from 'remark'
import {rehype} from 'rehype'
import rehypeFormat from 'rehype-format'
import {toVFile, read} from 'to-vfile'
import {trough} from 'trough'
import parseAuthor from 'parse-author'
import strip from 'strip-indent'
import remarkPresetWooorm from 'remark-preset-wooorm'

/** @type {PackageJson} */
const pkg = JSON.parse(String(fs.readFileSync('package.json')))

const proc = remark().use({settings: remarkPresetWooorm.settings})

export const pipelineReadme = trough()
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files: Array<string>, tests: boolean, packageValue?: PackageJson}} ctx
     */
    (ctx) => {
      ctx.packageValue = JSON.parse(String(ctx.package))
    }
  )
  .use(
    /**
     * @param {{root: string, ancestor: string, plugins: Array<string>, package: VFile, contributors: Array<string>, files: Array<string>, tests: boolean, packageValue: PackageJson, readme?: VFile}} ctx
     */
    // eslint-disable-next-line complexity
    async (ctx) => {
      const script = await read(path.join(ctx.root, 'index.js'))
      const fileInfo = parse(String(script), {spacing: 'preserve'})[0]
      const tags = fileInfo.tags
      const exampleTag = tags.find((d) => d.tag === 'example')
      const description = strip(fileInfo.description).trim()

      if (typeof pkg.repository !== 'string') {
        throw new TypeError(
          'Expected `repository` in root `package.json` as a string'
        )
      }

      const packageValue = ctx.packageValue

      if (typeof packageValue.author !== 'string') {
        throw new TypeError(
          'Expected `author` in local `package.json` as a string'
        )
      }

      if (!packageValue.name) {
        throw new Error('Expected `name` in local `package.json`')
      }

      const basename = packageValue.name
      const version = (packageValue.version || '0').split('.')[0]
      const author = parseAuthor(packageValue.author)
      const id = basename
        .replace(/-([a-z])/g, (_, /** @type {string} */ $1) => $1.toUpperCase())
        .replace(/Javascript/g, 'JavaScript')
      const remote = pkg.repository
      const org = remote.split('/').slice(0, -1).join('/')
      const main = remote + '/blob/main'
      const health = org + '/.github'
      const hMain = health + '/blob/main'
      const slug = remote.split('/').slice(-2).join('/')
      const descriptionTree = /** @type {Root} */ (
        // @ts-expect-error: to do: remove (and cast) when released.
        unified().use(remarkParse).parse(description)
      )
      /** @type {Record<string, unknown> & {default?: Function}} */
      const mod = await import(script.path)
      const specifiers = Object.keys(mod).filter((d) => d !== 'default')
      /** @type {Array<PhrasingContent>} */
      const info = []
      let importable = id
      let referencesRehype = false
      let referencesRehypeFormat = false
      let referencesHast = false

      if (specifiers.length > 0) {
        info.push({
          type: 'text',
          value: 'This package exports the following identifiers:\n'
        })

        let index = -1
        while (++index < specifiers.length) {
          if (index !== 0) {
            info.push({type: 'text', value: ', '})
          }

          info.push({type: 'inlineCode', value: specifiers[index]})
        }

        info.push({type: 'text', value: '.'})
      } else {
        info.push({
          type: 'text',
          value: 'This package exports no identifiers.'
        })
      }

      if (mod.default) {
        if (!('name' in mod.default)) {
          throw new Error('Expected `name` in default export')
        }

        info.push(
          {type: 'text', value: '\nThe default export is '},
          {type: 'inlineCode', value: mod.default.name},
          {type: 'text', value: '.'}
        )
      } else {
        if (specifiers.length > 2) {
          importable = '* as ' + id
        } else if (specifiers.length > 0) {
          importable = '{' + specifiers.join(', ') + '}'
        }

        info.push({type: 'text', value: '\nThere is no default export.'})
      }

      const descriptionContent = /** @type {Array<BlockContent>} */ (
        descriptionTree.children
      )

      /** @type {Record<string, Array<BlockContent>>} */
      const categories = {}
      let category = 'intro'
      let contentIndex = -1

      while (++contentIndex < descriptionContent.length) {
        const node = descriptionContent[contentIndex]

        if (node.type === 'heading' && node.depth === 2) {
          category = githubSlug(toString(node))
        }

        if (!(category in categories)) {
          categories[category] = []
        }

        categories[category].push(node)
      }

      /** @type {Root} */
      const introRoot = {type: 'root', children: categories.intro || []}

      // Autolink `rehype` / `hast`.
      unified()
        .use(
          /** @type {import('unified').Plugin<Array<void>, import('mdast').Root>} */
          () => (tree) => {
            findAndReplace(tree, [
              [
                /rehype/g,
                /** @type {ReplaceFunction} */
                () => {
                  referencesRehype = true
                  return {
                    type: 'strong',
                    children: [
                      {
                        type: 'linkReference',
                        identifier: 'rehype',
                        referenceType: 'collapsed',
                        children: [{type: 'text', value: 'rehype'}]
                      }
                    ]
                  }
                }
              ],
              [
                /hast/g,
                /** @type {ReplaceFunction} */
                () => {
                  referencesHast = true
                  return {
                    type: 'linkReference',
                    identifier: 'hast',
                    referenceType: 'full',
                    children: [{type: 'inlineCode', value: 'hast'}]
                  }
                }
              ]
            ])
          }
        )
        .runSync(introRoot)

      if (!categories.use && ctx.plugins.includes(basename)) {
        if (!('default' in mod) || !mod.default || mod.default.name !== id) {
          throw new Error(
            'Expected default export called `' +
              id +
              '`' +
              (mod.default ? ', not `' + mod.default.name + '`' : '')
          )
        }

        categories.use = [
          {type: 'heading', depth: 2, children: [{type: 'text', value: 'Use'}]},
          {
            type: 'paragraph',
            children: [{type: 'text', value: 'On the API:'}]
          },
          {
            type: 'code',
            lang: 'js',
            value: [
              "import {read} from 'to-vfile'",
              "import {unified} from 'unified'",
              "import rehypeParse from 'rehype-parse'",
              "import rehypeStringify from 'rehype-stringify'",
              'import ' + id + " from '" + basename + "'",
              '',
              'main()',
              '',
              'async function main() {',
              '  const file = await unified()',
              '    .use(rehypeParse)',
              '    .use(' + id + ')',
              '    .use(rehypeStringify)',
              "    .process(await read('index.html'))",
              '',
              '  console.log(String(file))',
              '}'
            ].join('\n')
          },
          {type: 'paragraph', children: [{type: 'text', value: 'On the CLI:'}]},
          {
            type: 'code',
            lang: 'sh',
            value:
              'rehype input.html --use ' + basename + ' --output output.html'
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
              '+    "' + basename + '",',
              '     …',
              '   ]',
              ' }',
              ' …'
            ].join('\n')
          }
        ]
      }

      if (!categories.api) {
        categories.api = [
          {type: 'heading', depth: 2, children: [{type: 'text', value: 'API'}]}
        ]
      }

      if (ctx.plugins.includes(basename) && exampleTag) {
        /** @type {Record<string, unknown>} */
        let options = {}
        const lines = exampleTag.description
          .replace(/^\r?\n|\r?\n$/g, '')
          .split('\n')
        const [headLine, ...restLines] = lines

        try {
          options = JSON.parse(headLine)
        } catch {
          restLines.unshift(headLine)
        }

        const exampleValue = strip(restLines.join('\n').replace(/^\r?\n/g, ''))

        categories.api.push(
          {
            type: 'heading',
            depth: 2,
            children: [{type: 'text', value: 'Example'}]
          },
          {type: 'heading', depth: 6, children: [{type: 'text', value: 'In'}]},
          {type: 'code', lang: 'html', value: exampleValue},
          {type: 'heading', depth: 6, children: [{type: 'text', value: 'Out'}]}
        )

        if (options.plugin || options.format) {
          /** @type {Array<PhrasingContent>} */
          const phrase = [{type: 'text', value: '(with '}]

          if (options.plugin) {
            phrase.push(
              {type: 'inlineCode', value: inspect(options.plugin)},
              {type: 'text', value: ' as options'}
            )
          }

          if (options.plugin && options.format) {
            phrase.push({type: 'text', value: ' and with '})
          }

          if (options.format) {
            referencesRehypeFormat = true
            phrase.push({
              type: 'linkReference',
              identifier: 'rehype-format',
              referenceType: 'full',
              children: [{type: 'inlineCode', value: 'rehype-format'}]
            })
          }

          phrase.push({type: 'text', value: ')'})

          categories.api.push({type: 'paragraph', children: phrase})
        }

        categories.api.push({
          type: 'code',
          lang: 'html',
          value: rehype()
            // Assume `fragment` as default.
            .data('settings', options.processor || {fragment: true})
            // @ts-expect-error: Assume `default` is usable.
            .use(mod.default, options.plugin || undefined)
            // @ts-expect-error: `undefined` is fine to pass.
            .use(options.format ? rehypeFormat : undefined)
            .processSync(exampleValue)
            .toString()
            .trim()
        })
      }

      const [apiHeading, ...apiRest] = categories.api

      referencesHast = true

      /** @type {Array<BlockContent|DefinitionContent>} */
      const children = [
        {type: 'html', value: '<!--This file is generated-->'},
        {
          type: 'heading',
          depth: 1,
          children: [{type: 'text', value: basename}]
        },
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
              identifier: 'collective',
              referenceType: 'full',
              children: [
                {
                  type: 'imageReference',
                  identifier: 'sponsors-badge',
                  referenceType: 'full',
                  alt: 'Sponsors'
                }
              ]
            },
            {type: 'text', value: '\n'},
            {
              type: 'linkReference',
              identifier: 'collective',
              referenceType: 'full',
              children: [
                {
                  type: 'imageReference',
                  identifier: 'backers-badge',
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
        },
        ...(categories.intro || []),
        {
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Contents'}]
        },
        ...(categories['what-is-this'] || []),
        ...(categories['when-should-i-use-this'] || []),
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
              value:
                '.\nIn Node.js (version 12.20+, 14.14+, or 16.0+), ' +
                'install with '
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
        {type: 'code', lang: 'sh', value: 'npm install ' + basename},
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'In Deno with '},
            {
              type: 'linkReference',
              identifier: 'esmsh',
              label: 'esmsh',
              referenceType: 'full',
              children: [{type: 'inlineCode', value: 'esm.sh'}]
            },
            {type: 'text', value: ':'}
          ]
        },
        {
          type: 'code',
          lang: 'js',
          value:
            'import ' +
            importable +
            " from 'https://esm.sh/" +
            basename +
            '@' +
            version +
            "'"
        },
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'In browsers with '},
            {
              type: 'linkReference',
              identifier: 'esmsh',
              label: 'esmsh',
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
            importable +
            " from 'https://esm.sh/" +
            basename +
            '@' +
            version +
            "?bundle'\n</script>"
        },
        ...(categories.use || []),
        apiHeading,
        {type: 'paragraph', children: info},
        ...apiRest,
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
            {type: 'text', value: 'The syntax tree format used is '},
            {
              type: 'linkReference',
              identifier: 'hast',
              referenceType: 'full',
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
                ' works on HTML, and improper use of HTML can open you up to a\n'
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
              children: [
                {type: 'text', value: String(packageValue.license || '')}
              ]
            },
            {type: 'text', value: ' © '},
            {
              type: 'linkReference',
              referenceType: 'full',
              identifier: 'author',
              children: [{type: 'text', value: String(author.name || '')}]
            }
          ]
        },
        {
          type: 'definition',
          identifier: 'build-badge',
          url: 'https://github.com/' + slug + '/workflows/main/badge.svg'
        },
        {
          type: 'definition',
          identifier: 'build',
          url: 'https://github.com/' + slug + '/actions'
        },
        {
          type: 'definition',
          identifier: 'coverage-badge',
          url: 'https://img.shields.io/codecov/c/github/' + slug + '.svg'
        },
        {
          type: 'definition',
          identifier: 'coverage',
          url: 'https://codecov.io/github/' + slug
        },
        {
          type: 'definition',
          identifier: 'downloads-badge',
          url: 'https://img.shields.io/npm/dm/' + basename + '.svg'
        },
        {
          type: 'definition',
          identifier: 'downloads',
          url: 'https://www.npmjs.com/package/' + basename
        },
        {
          type: 'definition',
          identifier: 'size-badge',
          url: 'https://img.shields.io/bundlephobia/minzip/' + basename + '.svg'
        },
        {
          type: 'definition',
          identifier: 'size',
          url: 'https://bundlephobia.com/result?p=' + basename
        },
        {
          type: 'definition',
          identifier: 'sponsors-badge',
          url: 'https://opencollective.com/unified/sponsors/badge.svg'
        },
        {
          type: 'definition',
          identifier: 'backers-badge',
          url: 'https://opencollective.com/unified/backers/badge.svg'
        },
        {
          type: 'definition',
          identifier: 'collective',
          url: 'https://opencollective.com/unified'
        },
        {
          type: 'definition',
          identifier: 'chat-badge',
          url: 'https://img.shields.io/badge/chat-discussions-success.svg'
        },
        {
          type: 'definition',
          identifier: 'chat',
          url: 'https://github.com/rehypejs/rehype/discussions'
        },
        {
          type: 'definition',
          identifier: 'esm',
          url: 'https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c'
        },
        {
          type: 'definition',
          identifier: 'npm',
          url: 'https://docs.npmjs.com/cli/install'
        },
        {
          type: 'definition',
          identifier: 'esmsh',
          url: 'https://esm.sh'
        },
        {
          type: 'definition',
          identifier: 'typescript',
          url: 'https://www.typescriptlang.org'
        },
        {
          type: 'definition',
          identifier: 'rehype-sanitize',
          url: 'https://github.com/rehypejs/rehype-sanitize'
        },
        {
          type: 'definition',
          identifier: 'xss',
          url: 'https://en.wikipedia.org/wiki/Cross-site_scripting'
        },
        {
          type: 'definition',
          identifier: 'health',
          url: health
        },
        {
          type: 'definition',
          identifier: 'contributing',
          url: hMain + '/contributing.md'
        },
        {
          type: 'definition',
          identifier: 'support',
          url: hMain + '/support.md'
        },
        {
          type: 'definition',
          identifier: 'coc',
          url: hMain + '/code-of-conduct.md'
        },
        {
          type: 'definition',
          identifier: 'license',
          url: main + '/license'
        },
        {
          type: 'definition',
          identifier: 'author',
          url: String(author.url || '')
        }
      ]

      if (referencesHast) {
        children.push({
          type: 'definition',
          identifier: 'hast',
          url: 'https://github.com/syntax-tree/hast'
        })
      }

      if (referencesRehype) {
        children.push({
          type: 'definition',
          identifier: 'rehype',
          url: 'https://github.com/rehypejs/rehype'
        })
      }

      if (referencesRehypeFormat) {
        children.push({
          type: 'definition',
          identifier: 'rehype-format',
          url: 'https://github.com/rehypejs/rehype-format'
        })
      }

      ctx.readme = toVFile(path.join(ctx.root, 'readme.md'))
      /** @type {Root} */
      const root = {type: 'root', children}
      // @ts-expect-error: to do: remove when remark is released.
      ctx.readme.value = proc.stringify(root, ctx.readme)
    }
  )
  .use(
    /**
     * @param {{readme: VFile}} ctx
     * @param {Next} next
     */
    (ctx, next) => {
      fs.writeFile(ctx.readme.path, String(ctx.readme), next)
    }
  )
  .use(
    /**
     * @param {{readme: VFile}} ctx
     */
    (ctx) => {
      ctx.readme.stored = true
    }
  )
