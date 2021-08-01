/**
 * @fileoverview
 *   Map of URL attributes in HTML
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   import {urlAttributes} from 'html-url-attributes'
 *
 *   urlAttributes.formAction
 *   //=> ['button', 'input']
 *   urlAttributes.href
 *   //=> ['a', 'area', 'base', 'link']
 *   ```
 *
 *   ## API
 *
 *   ### `urlAttributes`
 *
 *   Map of URL attributes in HTML (`Record<string, string[]>`).
 */

/**
 * @type {Record<string, string[]|null>}
 */
export const urlAttributes = {
  action: ['form'],
  cite: ['blockquote', 'del', 'ins', 'q'],
  data: ['object'],
  formAction: ['button', 'input'],
  href: ['a', 'area', 'base', 'link'],
  icon: ['menuitem'],
  itemId: null,
  manifest: ['html'],
  ping: ['a', 'area'],
  poster: ['video'],
  src: [
    'audio',
    'embed',
    'iframe',
    'img',
    'input',
    'script',
    'source',
    'track',
    'video'
  ]
}
