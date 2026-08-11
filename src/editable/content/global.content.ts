import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Collected links, useful reading, and visual discovery',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    
    utility: ['', ``],
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'Collections', href: '/sbm' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse Collections', href: '/sbm' },
      secondary: { label: 'Submit', href: '/create' },
    },
  },
  footer: {
    description: 'Discover, save, and share the web’s most valuable content in one organized place. Our social bookmarking platform helps users collect articles, websites, resources, tools, images, and links while exploring curated discoveries from a growing community. Find inspiration, track useful content, and connect with people who share your interests.',
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
         
        ],
      },
    ],
    bottomNote: 'Designed for calm browsing, quick scanning, and connected discovery.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
