import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'editorial-noir'
  | 'luxury-editorial'
  | 'collection-index'
  | 'gallery-led'

export const visualPresets = {
  'editorial-noir': {
    label: 'Editorial Noir',
    mood: 'dark, premium, high-contrast',
    fontDirection: 'bold uppercase display with measured body copy',
    colors: {
      background: '#f7f0e6',
      foreground: '#11264c',
      muted: '#617286',
      primary: '#1a3263',
      accent: '#ffc570',
      surface: '#ffffff',
    },
    shape: 'wide slabs, floating cards, restrained borders',
  },
  'luxury-editorial': {
    label: 'Luxury Editorial',
    mood: 'polished, confident, spacious',
    fontDirection: 'statement headlines with calm sans body text',
    colors: {
      background: '#f7f0e6',
      foreground: '#11264c',
      muted: '#5c7086',
      primary: '#547792',
      accent: '#ffc570',
      surface: '#fffaf4',
    },
    shape: 'editorial sections with offset panels and gold dividers',
  },
  'collection-index': {
    label: 'Collection Index',
    mood: 'curated, useful, structured',
    fontDirection: 'condensed labels with clean reading surfaces',
    colors: {
      background: '#f4ede2',
      foreground: '#1a3263',
      muted: '#66788b',
      primary: '#547792',
      accent: '#efd2b0',
      surface: '#ffffff',
    },
    shape: 'index cards, summary rails, and layered content blocks',
  },
  'gallery-led': {
    label: 'Gallery Led',
    mood: 'cinematic, visual, immersive',
    fontDirection: 'oversized display with spare captions',
    colors: {
      background: '#10141b',
      foreground: '#f8f2e8',
      muted: '#c2c7cf',
      primary: '#547792',
      accent: '#ffc570',
      surface: '#171b20',
    },
    shape: 'dark overlays, large visuals, and modular blocks',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset: 'luxury-editorial',
  radius: {
    sm: '0.75rem',
    md: '1.25rem',
    lg: '2rem',
    xl: '2.75rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    cardHover: 'transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_60px_rgba(9,17,31,0.18)]',
    softHover: 'transition duration-300 hover:opacity-92',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.34em]',
    heroTitle: 'text-5xl font-black uppercase leading-[0.94] tracking-[0.02em] sm:text-6xl lg:text-[5.35rem]',
    sectionTitle: 'text-4xl font-black uppercase tracking-[0.04em] sm:text-5xl',
    body: 'text-base leading-8',
    caption: 'text-[11px] font-black uppercase tracking-[0.26em]',
  },
  surfaces: {
    glass: 'border border-white/12 bg-white/8 backdrop-blur-xl',
    paper: 'border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)]',
    quiet: 'border border-[var(--slot4-border)] bg-[var(--slot4-panel-bg)]',
    dark: 'border border-[var(--slot4-gold-border)] bg-[var(--slot4-dark-surface)] shadow-[0_24px_70px_rgba(0,0,0,0.25)]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-18 lg:py-24',
    cardGrid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
