import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
  return raw.length > 180 ? `${raw.slice(0, 180).trim()}...` : raw
}
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Editorial cards, larger headlines, and a clearer reading rhythm.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Directory cards with more trust cues, location details, and business context.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Fast-scan offer cards with strong hierarchy and direct actions.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Image-led browsing with more space for visual impact.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Curated bookmark shelves designed for social discovery and scanning.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards arranged like a modern reference room.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-4', promise: 'Identity-led profile cards with cleaner metadata hierarchy.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': preset.colors.background,
    '--archive-text': preset.colors.foreground,
    '--archive-surface': preset.colors.surface,
    '--archive-accent': '#ffc570',
  } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const lead = posts[0]
  const leadImage = lead ? getImage(lead) : placeholder

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="relative overflow-hidden bg-[var(--slot4-hero-bg)] text-white">
          <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: `url(${leadImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,0.92),rgba(15,18,23,0.92))]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 border border-white/12 bg-white/4 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#ffc570]">
                  <Icon className="h-4 w-4" /> {voice.eyebrow}
                </div>
                <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.94] tracking-[0.04em] sm:text-6xl lg:text-7xl">{voice.headline}</h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/72">{voice.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="border border-white/12 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/76">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <form action={basePath} className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#ffc570]"><Filter className="h-4 w-4" /> {voice.filterLabel}</div>
                <select name="category" defaultValue={category} className="mt-4 h-12 w-full border border-white/10 bg-white px-4 text-sm font-bold text-[#11264c] outline-none">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="mt-3 h-12 w-full bg-[#ffc570] text-sm font-black uppercase tracking-[0.22em] text-[#11264c]">Apply</button>
                <p className="mt-4 text-sm leading-7 text-white/62">{deck.promise}</p>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--archive-accent)]">Showing</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.04em]">{categoryLabel}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={basePath} className="border border-[var(--slot4-border)] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Browse all</Link>
              <Link href="/search" className="inline-flex items-center gap-2 bg-[#1a3263] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">
                <Search className="h-4 w-4" /> Search posts
              </Link>
            </div>
          </div>

          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--slot4-border)] bg-white/70 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.04em]">No posts found</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">Try another category or publish fresh content to populate this section.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-[var(--slot4-border)] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Previous</Link> : null}
            <span className="bg-[#1a3263] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-[var(--slot4-border)] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(8,14,24,0.84)_100%)]" />
        <span className="absolute left-4 top-4 bg-[#ffc570] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#11264c]">{category}</span>
        <h2 className="absolute bottom-4 left-4 right-4 line-clamp-2 text-2xl font-black uppercase leading-tight tracking-[0.03em] text-white">{post.title}</h2>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[var(--slot4-border)] bg-white p-5 shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1.5 sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.4rem] bg-[var(--slot4-panel-bg)] ring-1 ring-[var(--slot4-border)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="bg-[#1a3263] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 border border-[var(--slot4-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-[var(--slot4-soft-muted-text)] sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1.5">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[#11161d] p-5 text-white">
          <span className="bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black uppercase leading-[1] tracking-[0.04em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/72">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-[1.2rem] object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1.5">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 bg-[var(--slot4-panel-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1.5 hover:bg-[#11264c] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="border border-current/18 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 opacity-74">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-58">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="rounded-[2rem] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1.5">
      <div className="flex items-start justify-between gap-4">
        <div className="bg-[#11161d] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="bg-[var(--slot4-panel-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="rounded-[2rem] border border-[var(--slot4-border)] bg-white p-6 text-center shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1.5">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-panel-bg)] ring-1 ring-[var(--slot4-border)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
