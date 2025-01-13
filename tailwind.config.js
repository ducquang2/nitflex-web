import { readdirSync, readFileSync } from 'fs'
import { basename, join } from 'path'
import plugin from 'tailwindcss/plugin'

import ReactPlayer from './src/libs/tailwind/react-player.ts'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  darkMode: ['selector', '[data-theme="coffee"]'],
  plugins: [
    require('daisyui'),
    plugin(function ({ matchComponents, theme }) {
      let iconsDir = join(__dirname, './src/assets/icons')

      let values = {}

      let icons = [
        ['', '/'],
        ['-mini', '/'],
        ['-micro', '/'],
      ]

      icons.forEach(([suffix, dir]) => {
        readdirSync(join(iconsDir, dir)).forEach((file) => {
          if (file === '.DS_Store') return // Ignore .DS_Store files

          let name = basename(file, '.svg') + suffix
          values[name] = { name, fullPath: join(iconsDir, dir, file) }
        })
      })

      matchComponents(
        {
          icon: ({ name, fullPath }) => {
            let content = readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, '')
            let size = theme('spacing.6')
            if (name.endsWith('-mini')) {
              size = theme('spacing.5')
            } else if (name.endsWith('-micro')) {
              size = theme('spacing.4')
            }
            return {
              [`--icon-${name}`]: `url('data:image/svg+xml;utf8,${encodeURIComponent(content)}')`,
              '-webkit-mask': `var(--icon-${name})`,
              mask: `var(--icon-${name})`,
              'mask-repeat': 'no-repeat',
              'mask-size': '100%',
              // 'mask-position': `0.125rem 0.125rem`,
              'background-color': 'currentColor',
              'vertical-align': 'middle',
              display: 'inline-block',
              minWidth: size,
              minHeight: size,
              width: size,
              height: size,
            }
          },
        },
        { values },
      )
    }),
    plugin(ReactPlayer),
  ],
  daisyui: {
    themes: ['lemonade', 'coffee'],
  },
}
