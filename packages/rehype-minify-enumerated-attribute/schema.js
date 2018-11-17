/* eslint-disable max-lines */
/**
 * @fileoverview
 *   This schema exposes a map of property names to (one or
 *   more) definitions.  Each definition defined how that
 *   attribute is enumerated.
 */

'use strict'

module.exports = {
  charSet: {
    tagNames: ['meta', 'script'],
    // In HTML5, utf8 is implied. But we let it be here for older versions.
    states: [
      ['utf8', 'utf-8', 'unicode-1-1-utf-8'],
      ['866', 'cp866', 'ibm866', 'csibm866'],
      [
        'l1',
        'ascii',
        'cp819',
        'cp1252',
        'ibm819',
        'latin1',
        'us-ascii',
        'x-cp1252',
        'iso88591',
        'iso8859-1',
        'iso_8859-1',
        'iso-8859-1',
        'iso-ir-100',
        'csisolatin1',
        'windows-1252',
        'ansi_x3.4-1968',
        'iso_8859-1:1987'
      ],
      [
        'l2',
        'csisolatin2',
        'iso-8859-2',
        'iso-ir-101',
        'iso8859-2',
        'iso88592',
        'iso_8859-2',
        'iso_8859-2:1987',
        'latin2'
      ],
      [
        'l3',
        'csisolatin3',
        'iso-8859-3',
        'iso-ir-109',
        'iso8859-3',
        'iso88593',
        'iso_8859-3',
        'iso_8859-3:1988',
        'latin3'
      ],
      [
        'l4',
        'csisolatin4',
        'iso-8859-4',
        'iso-ir-110',
        'iso8859-4',
        'iso88594',
        'iso_8859-4',
        'iso_8859-4:1988',
        'latin4'
      ],
      [
        'l5',
        'latin5',
        'cp1254',
        'x-cp1254',
        'iso88599',
        'iso8859-9',
        'iso-8859-9',
        'iso_8859-9',
        'iso-ir-148',
        'csisolatin5',
        'windows-1254',
        'iso_8859-9:1989'
      ],
      [
        'l6',
        'latin6',
        'iso885910',
        'iso-ir-157',
        'iso8859-10',
        'csisolatin6',
        'iso-8859-10'
      ],
      [
        'l9',
        'iso885915',
        'iso8859-15',
        'iso-8859-15',
        'iso_8859-15',
        'csisolatin9'
      ],
      ['cp1250', 'x-cp1250', 'windows-1250'],
      ['cp1251', 'x-cp1251', 'windows-1251'],
      ['cp1253', 'x-cp1253', 'windows-1253'],
      ['cp1255', 'x-cp1255', 'windows-1255'],
      ['cp1256', 'x-cp1256', 'windows-1256'],
      ['cp1257', 'x-cp1257', 'windows-1257'],
      ['cp1258', 'x-cp1258', 'windows-1258'],
      [
        'cyrillic',
        'iso88595',
        'iso8859-5',
        'iso-8859-5',
        'iso_8859-5',
        'iso-ir-144',
        'iso_8859-5:1988',
        'csisolatincyrillic'
      ],
      [
        'arabic',
        'iso88596',
        'ecma-114',
        'asmo-708',
        'iso8859-6',
        'iso-ir-127',
        'iso_8859-6',
        'iso-8859-6',
        'csiso88596e',
        'csiso88596i',
        'iso-8859-6-e',
        'iso-8859-6-i',
        'iso_8859-6:1987',
        'csisolatinarabic'
      ],
      [
        'greek',
        'greek8',
        'iso88597',
        'ecma-118',
        'elot_928',
        'iso8859-7',
        'iso-8859-7',
        'iso_8859-7',
        'iso-ir-126',
        'sun_eu_greek',
        'iso_8859-7:1987',
        'csisolatingreek'
      ],
      [
        'hebrew',
        'visual',
        'iso88598',
        'iso8859-8',
        'iso-8859-8',
        'iso_8859-8',
        'iso-ir-138',
        'csiso88598e',
        'iso-8859-8-e',
        'iso_8859-8:1988',
        'csisolatinhebrew'
      ],
      ['logical', 'csiso88598i', 'iso-8859-8-i'],
      ['iso885913', 'iso8859-13', 'iso-8859-13'],
      ['iso885914', 'iso8859-14', 'iso-8859-14'],
      ['iso-8859-16'],
      ['koi', 'koi8', 'koi8-r', 'koi8_r', 'cskoi8r'],
      ['koi8-u', 'koi8-ru'],
      ['mac', 'macintosh', 'csmacintosh', 'x-mac-roman'],
      [
        'dos-874',
        'tis-620',
        'iso885911',
        'iso8859-11',
        'iso-8859-11',
        'windows-874'
      ],
      ['x-mac-cyrillic', 'x-mac-ukrainian'],
      [
        'gbk',
        'x-gbk',
        'gb2312',
        'chinese',
        'gb_2312',
        'csgb2312',
        'iso-ir-58',
        'gb_2312-80',
        'csiso58gb231280'
      ],
      ['gb18030'],
      ['big5', 'csbig5', 'cn-big5', 'x-x-big5', 'big5-hkscs'],
      ['euc-jp', 'x-euc-jp', 'cseucpkdfmtjapanese'],
      ['csiso2022jp', 'iso-2022-jp'],
      [
        'ms932',
        'sjis',
        'x-sjis',
        'ms_kanji',
        'shift-jis',
        'shift_jis',
        'csshiftjis',
        'windows-31j'
      ],
      [
        'korean',
        'euc-kr',
        'cseuckr',
        'ksc5601',
        'ksc_5601',
        'iso-ir-149',
        'windows-949',
        'csksc56011987',
        'ks_c_5601-1987',
        'ks_c_5601-1989'
      ],
      [
        'hz-gb-2312',
        'csiso2022kr',
        'iso-2022-kr',
        'iso-2022-cn',
        'iso-2022-cn-ext'
      ],
      ['utf-16be'],
      ['utf-16', 'utf-16le'],
      ['x-user-defined']
    ]
  },
  crossOrigin: {
    tagNames: ['link', 'img', 'audio', 'video', 'script'],
    missing: null,
    invalid: '',
    states: [['', 'anonymous'], 'use-credentials']
  },
  // Should also apply to `content` on `meta[name=referrer]`.
  referrerpolicy: {
    tagNames: ['link', 'a', 'area', 'img', 'iframe'],
    missing: '',
    invalid: '',
    states: [
      '',
      'no-referrer',
      'origin',
      'no-referrer-when-downgrade',
      'origin-when-cross-origin',
      'unsafe-url'
    ]
  },
  translate: {
    tagNames: null,
    missing: null,
    invalid: null,
    states: [['', 'yes'], 'no']
  },
  contentEditable: {
    tagNames: null,
    missing: null,
    invalid: null,
    states: [null, ['', 'true'], 'false']
  },
  spellCheck: {
    tagNames: null,
    missing: null,
    invalid: null,
    states: [null, ['', 'true'], 'false']
  },
  draggable: {
    tagNames: null,
    missing: null,
    states: [null, 'true', 'false']
  },
  autoComplete: {
    tagNames: null,
    missing: '',
    states: [['', 'on'], 'off']
  },
  dir: {
    tagNames: null,
    missing: '',
    invalid: '',
    states: ['', 'ltr', 'rtl', 'auto']
  },
  kind: {
    tagNames: 'track',
    missing: 'subtitles',
    invalid: 'metadata',
    states: ['subtitles', 'captions', 'descriptions', 'chapters', 'metadata']
  },
  preload: {
    tagNames: ['audio', 'video'],
    // Note: https://html.spec.whatwg.org/#attr-media-preload
    states: ['none', 'metadata', ['', 'auto']]
  },
  shape: {
    tagNames: 'area',
    missing: 'rect',
    states: [
      // The latter are non-conforming.
      ['rect', 'rectangle'],
      ['poly', 'polygon'],
      ['circle', 'circ'],
      'default'
    ]
  },
  scope: {
    tagNames: 'th',
    missing: '',
    states: ['', 'row', 'col', 'rowgroup', 'colgroup']
  },
  type: [
    {
      tagNames: 'button',
      missing: 'submit',
      states: ['submit', 'reset', 'button', 'menu']
    },
    {
      tagNames: 'menu',
      missing: '',
      states: ['', 'context', 'toolbar']
    },
    {
      tagNames: 'menuitem',
      missing: 'command',
      states: ['command', 'checkbox', 'radio']
    },
    {
      tagNames: 'input',
      missing: 'text',
      states: [
        'text',
        'hidden',
        'search',
        'tel',
        'url',
        'email',
        'password',
        'date',
        'month',
        'week',
        'time',
        'datetime-local',
        'number',
        'range',
        'color',
        'checkbox',
        'radio',
        'file',
        'submit',
        'image',
        'reset',
        'button'
      ]
    }
  ],
  wrap: {
    tagNames: 'textarea',
    missing: 'soft',
    states: ['soft', 'hard']
  },
  keyType: {
    tagNames: 'keygen',
    missing: 'rsa',
    states: ['', 'rsa']
  },
  // Also for `formMethod` on submit buttons.
  method: {
    tagNames: 'form',
    invalid: 'get',
    missing: 'get',
    states: ['get', 'post', 'dialog']
  },
  // Also for `formEncType` on submit buttons.
  encType: {
    tagNames: 'form',
    invalid: 'application/x-www-form-urlencoded',
    missing: 'application/x-www-form-urlencoded',
    states: [
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ]
  },
  inputMode: {
    // In fact only applies to `text`, `search`, and `password`.
    tagNames: 'input',
    invalid: '',
    missing: '',
    states: [
      '',
      'verbatim',
      'latin',
      'latin-name',
      'latin-prose',
      'full-width-latin',
      'kana',
      'kana-name',
      'katakana',
      'numeric',
      'tel',
      'email',
      'url'
    ]
  },
  behavior: {
    tagNames: 'marquee',
    missing: 'scroll',
    states: ['scroll', 'slide', 'alternate']
  },
  direction: {
    tagNames: 'marquee',
    missing: 'left',
    states: ['left', 'right', 'up', 'down']
  }
}
