import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated links, stories, and collected discovery',
      description: 'Browse bookmarks, stories, profiles, visuals, and documents through a premium editorial interface.',
      openGraphTitle: 'Curated links, stories, and collected discovery',
      openGraphDescription: 'Discover useful bookmarks, long-form reads, and visual posts through one polished browsing surface.',
      keywords: ['social bookmarking', 'curated links', 'editorial discovery', 'saved resources'],
    },
    hero: {
      badge: '',
      title: ['Collected pages with a sharper', 'editorial point of view.'],
      description: 'LetsActuallyGo turns saved links, useful posts, and supporting content into a cleaner premium browse. Start from the headline moments, then move into the archive without losing the thread.',
      primaryCta: { label: 'Browse collections', href: '/sbm' },
      secondaryCta: { label: 'Search the archive', href: '/search' },
      searchPlaceholder: 'Search saved links, stories, profiles, and documents',
    },
    intro: {
      badge: 'What we are',
      title: 'A more refined home for bookmarked discovery.',
      paragraphs: [
        'The site is organized like a modern editorial front page instead of a generic feed, giving useful links and fresh posts more presence.',
        'Readers can move between saved resources, article-style posts, directories, profiles, and supporting files without the layout feeling fragmented.',
        'The result is a browsing experience that feels more intentional, more visual, and easier to trust at a glance.',
      ],
      primaryLink: { label: 'Explore collections', href: '/sbm' },
      secondaryLink: { label: '', href: '/article' },
    },
    cta: {
      badge: 'Stay in motion',
      title: 'Keep exploring from one section to the next.',
      description: 'Move from saved resources to long-form reading, visual posts, and reference pages without changing your rhythm.',
      primaryCta: { label: 'Open Search', href: '/search' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
  },
  about: {
    badge: 'Who we are',
    title: 'A curated front page for the useful parts of the web.',
    description: `${slot4BrandConfig.siteName} is designed to make bookmarked discovery feel deliberate, visual, and easy to revisit.`,
    paragraphs: [
      'Instead of showing everything in one flat stream, the site groups important posts into stronger sections with room for hierarchy and context.',
      'That approach helps useful links, story-driven posts, and supporting resources feel more like a publication and less like a list.',
    ],
    values: [
      {
        title: 'Curated presentation',
        description: 'Important posts get structure, spacing, and visual hierarchy rather than being treated like generic cards.',
      },
      {
        title: 'Fast discovery',
        description: 'Collections, search, topic rails, and related content keep navigation fast without making the layout noisy.',
      },
      {
        title: 'Consistent trust cues',
        description: 'Metadata, categories, summaries, and actions stay visible even when each content type has its own card style.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A contact page with the same editorial polish as the front page.',
    description: 'Reach out about publishing, partnerships, discovery questions, or help finding the right lane for your content.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search saved links, articles, visuals, profiles, listings, and documents.',
    },
    hero: {
      badge: 'Archive search',
      title: 'Search the site like a curated index.',
      description: 'Filter across content types and categories to find saved resources, published stories, and supporting pages faster.',
      placeholder: 'Search by title, topic, tag, category, or keyword',
    },
    resultsTitle: 'Recent searchable posts',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to open the publishing desk.',
      description: 'Use your account to create a new post, add source information, and save a clean draft inside the current browser.',
    },
    hero: {
      badge: 'Publishing desk',
      title: 'Create a post with room for title, source, summary, and body.',
      description: 'Choose the active section, add the important details, and save a polished draft without changing any live site logic.',
    },
    formTitle: 'Post details',
    submitLabel: 'Save draft',
    successTitle: 'Draft saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Return to your editorial workspace.',
      description: 'Login to create drafts, manage your browsing flow, and move through the site with a saved local session.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create one first, then try again.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Create access',
      title: 'Start your account and open the publishing desk.',
      description: 'Create a local account to save drafts, access the create page, and keep your session active on this browser.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit site',
    },
  },
} as const
