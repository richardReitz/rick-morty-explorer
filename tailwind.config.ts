import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1A1A1A',
        'bg-secondary': '#1E1E20',
        'bg-surface': '#313234',
        'cyan-primary': '#11B0C8',
        'cyan-secondary': '#42B4CA',
        'lime-brand': '#BFDE42',
      },
      fontSize: {
        h1: ['48px', { lineHeight: '100%', fontWeight: '700' }],
        h2: ['32px', { lineHeight: '100%', fontWeight: '400' }],
        h3: ['24px', { lineHeight: '100%', fontWeight: '700' }],
        h4: ['16px', { lineHeight: '100%', fontWeight: '400' }],
        body: ['14px', { lineHeight: '100%', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

export default config
