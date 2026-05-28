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
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-surface': 'var(--bg-surface)',
        'cyan-primary': '#11B0C8',
        'cyan-secondary': '#42B4CA',
        'lime-brand': '#BFDE42',
        'foreground': 'var(--foreground)',
        'foreground-strong': 'var(--foreground-strong)',
        'muted': 'var(--muted)',
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
