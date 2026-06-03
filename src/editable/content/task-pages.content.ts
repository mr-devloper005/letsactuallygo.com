import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading desk',
    headline: 'Articles arranged like a premium editorial archive.',
    description: 'Longer reading should feel spacious, confident, and easy to scan from headline to excerpt.',
    filterLabel: 'Filter article category',
    secondaryNote: 'Use the archive to move between timely reads, deeper explainers, and thoughtful summaries.',
    chips: ['Lead stories', 'Editorial cards', 'Reading rhythm'],
  },
  classified: {
    eyebrow: 'Offers and notices',
    headline: 'Classified posts with clear urgency and stronger structure.',
    description: 'Short-form offers, notices, and listings need direct cues, quick summaries, and obvious next steps.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Fast-moving posts should still feel polished, not cramped.',
    chips: ['Urgency', 'Quick scan', 'Direct action'],
  },
  sbm: {
    eyebrow: 'Curated collections',
    headline: 'Saved links presented like a refined discovery shelf.',
    description: 'This archive is designed for social bookmarking first, with room for source, context, and visual hierarchy.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Use the top filter and search cues to move between saved topics quickly.',
    chips: ['Bookmarks', 'Curated links', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Profiles that surface identity before everything else.',
    description: 'People, brands, and public profiles should be easy to recognize, compare, and open from a distance.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Identity, role, and trust cues carry the page here.',
    chips: ['Identity', 'Recognition', 'Profile cards'],
  },
  pdf: {
    eyebrow: 'Document room',
    headline: 'Documents displayed as a clean reference library.',
    description: 'Guides, files, reports, and downloadable pages should feel organized, dependable, and easy to revisit.',
    filterLabel: 'Filter document category',
    secondaryNote: 'Document cards need context before download.',
    chips: ['Documents', 'Reference', 'Downloads'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Listings built for discovery, trust, and comparison.',
    description: 'Directory content works best when location, business identity, and contact cues stay close to the title.',
    filterLabel: 'Filter listing category',
    secondaryNote: 'Practical information should stay visible without flattening the design.',
    chips: ['Businesses', 'Compare', 'Local cues'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image posts with more atmosphere and less clutter.',
    description: 'Visual content should open with impact while still preserving summaries and related discovery paths.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let strong imagery lead before metadata steps in.',
    chips: ['Visual-first', 'Gallery mood', 'Image-led cards'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
