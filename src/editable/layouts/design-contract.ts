import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f7f0e6',
  '--slot4-page-text': '#11264c',
  '--slot4-panel-bg': '#fffaf4',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#5e6e82',
  '--slot4-soft-muted-text': '#7b8a99',
  '--slot4-accent': '#ffc570',
  '--slot4-accent-fill': '#547792',
  '--slot4-accent-soft': '#efd2b0',
  '--slot4-dark-bg': '#111418',
  '--slot4-dark-surface': '#171b20',
  '--slot4-dark-text': '#f8f2e8',
  '--slot4-media-bg': '#d7dee7',
  '--slot4-hero-bg': 'linear-gradient(180deg, #0c0f14 0%, #171c24 100%)',
  '--slot4-body-gradient': 'linear-gradient(180deg, #10141b 0px, #10141b 740px, #f7f0e6 740px, #f7f0e6 100%)',
  '--slot4-border': 'rgba(17, 38, 76, 0.11)',
  '--slot4-gold-border': 'rgba(255, 197, 112, 0.32)',
  '--slot4-shadow': '0 28px 80px rgba(9, 17, 31, 0.12)',
  '--editable-container': '1380px',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent)]',
  accentFillBg: 'bg-[var(--slot4-accent-fill)]',
  accentFillText: 'text-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkSurfaceBg: 'bg-[var(--slot4-dark-surface)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  border: 'border-[var(--slot4-border)]',
  goldBorder: 'border-[var(--slot4-gold-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[var(--slot4-shadow)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-18 lg:py-24',
  },
  layout: {
    rail: 'flex snap-x gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[220px] shrink-0 snap-start sm:w-[250px]',
    cardGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.34em]',
    heroTitle: 'text-5xl font-black uppercase leading-[0.94] tracking-[0.02em] sm:text-6xl lg:text-[5.35rem]',
    sectionTitle: 'text-4xl font-black uppercase leading-[0.98] tracking-[0.04em] sm:text-5xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[2rem] border ${editablePalette.goldBorder} ${editablePalette.darkSurfaceBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center gap-2 rounded-none bg-[var(--slot4-accent-fill)] px-8 py-4 text-sm font-black uppercase tracking-[0.26em] text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(84,119,146,0.35)]',
    secondary: 'inline-flex items-center justify-center gap-2 rounded-none border border-white/14 bg-transparent px-8 py-4 text-sm font-black uppercase tracking-[0.26em] text-white transition duration-300 hover:bg-white/8',
    light: 'inline-flex items-center justify-center gap-2 rounded-none bg-[var(--slot4-accent)] px-8 py-4 text-sm font-black uppercase tracking-[0.26em] text-[#11264c] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(255,197,112,0.32)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.5rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_60px_rgba(9,17,31,0.16)]',
    fade: 'transition duration-300 hover:opacity-90',
  },
} as const

export const aiLayoutRules = [
  'Lead with a dark premium masthead and allow lighter editorial sections to emerge below it.',
  'Use the Slot 4 palette variables instead of hardcoded random colors whenever possible.',
  'Preserve dynamic post rendering and safe fallbacks for image, summary, category, and slug.',
  'Mix featured, compact, horizontal, list, and image-first card styles instead of repeating one card.',
  'Keep typography bold, spacious, and editorial rather than app-like.',
  'Make mobile layouts stack cleanly without losing hierarchy or causing overflow.',
] as const
